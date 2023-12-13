import React, { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Button, StyleSheet, Text, View } from 'react-native';
import LoginScreen from './LoginScreen';
import Loading from '../components/common/Loading';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';


export default function IndexScreen(props) {
  const { navigation } = props;
  const [sesion, setSesion] = useState(null);
  const [loadingNames, setLoadingNames] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const cameraRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [isScanning, setIsScanning] = useState(true);


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setSesion(user ? true : false);
    });

    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, 'users'), (querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const { name, date } = doc.data();
        userList.push({
          id: doc.id,
          name,
          date,
        });
      });
      setUsers(userList);
      setLoadingNames(false);
    });
    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (querySnapshot) => {
      const projectList = [];
      querySnapshot.forEach((doc) => {
        const { nameProject } = doc.data();
        projectList.push({
          id: doc.id,
          name: nameProject, // assuming the field is named nameProject
        });
      });
      setProjects(projectList);
    });
    return () => {
      unsubscribe();
      unsubscribeProjects();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
          setCameraPermissionGranted(true); // Nuevo estado para controlar permisos
        } else {
          console.log('Permiso de cámara no otorgado');
        }
      } catch (error) {
        console.error('Error al solicitar permisos de cámara:', error);
      }
    })();
  }, []);
  
  const handleBarcodeRead = async (result) => {
    try {
      if (!result.cancelled) {
        const scannedUserId = result.data;
        console.log('Código QR escaneado - ID de Usuario:', scannedUserId);
  
        // Verificar si el usuario con el ID escaneado existe en la base de datos
        const userExists = users.some((user) => user.id === scannedUserId);
  
        if (userExists) {
          // Si el usuario existe, seleccionarlo automáticamente
          const selectedUser = users.find((user) => user.id === scannedUserId);
          setSelectedUser(selectedUser);
  
          // Mostrar un mensaje o realizar otras acciones si es necesario
          console.log('Usuario encontrado en la base de datos:', selectedUser);
  
          // También puedes ocultar automáticamente el escáner aquí si lo deseas
          setIsScannerVisible(true);
        } else {
          // Si el usuario no existe, mostrar un mensaje de error o tomar las medidas adecuadas
          console.warn('Usuario no encontrado en la base de datos. Escanea un QR válido.');
        }
      }
    } catch (error) {
      console.error('Error al manejar el código QR leído:', error);
    }
  };

  const handleConfirm = async () => {
    if (selectedUser && selectedProjectId) {
      try {
        setIsScannerVisible(true);
        const db = getFirestore();
        const entryRef = collection(db, 'entries');
        const entryData = {
          userId: selectedUser.id,
          projectId: selectedProjectId,
          entryTime: serverTimestamp(),
        };
        await addDoc(entryRef, entryData);

        // Buscar el nombre del proyecto en la lista de proyectos
        const selectedProject = projects.find((project) => project.id === selectedProjectId);
        const projectName = selectedProject ? selectedProject.name : 'Desconocido';

        // Mostrar alert con detalles
        const formattedTime = new Date().toLocaleTimeString();
        const alertMessage = `Usuario: ${selectedUser.name}\nHora registrada: ${formattedTime}\nProyecto asignado: ${projectName}`;
        Alert.alert('Entrada Registrada', alertMessage);
        
        console.log('Hora de entrada registrada en Firebase con proyecto asignado.');
      } catch (error) {
        console.error('Error al registrar la hora de entrada:', error);
      }finally{
        setSelectedUser(null);
        setSelectedProjectId(null);
        setIsScanning(true);
      }
    } else {
      Alert.alert('Por favor, selecciona un proveedor y un proyecto antes de confirmar la entrada.');
    }
  };

  if (loadingNames || sesion === null) {
    return <Loading visible={true} text={'Cargando'} />;
  }

  if (hasPermission === null) {
    return <Text>Esperando permisos de la cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No tienes permisos para acceder a la cámara.</Text>;
  }

  
  return sesion ? (
    <View style={styles.viewForm}>
      <Text style={styles.hora}>{currentTime}</Text>
      <Text >Selecciona proveedor: </Text>
      <Picker
        selectedValue={selectedUser ? selectedUser.id : null}
        onValueChange={(itemValue, itemIndex) => {
          const user = users.find((u) => u.id === itemValue);
          setSelectedUser(user);
        }}
        style={styles.pickerStyle}
      >
        
        <Picker.Item label="Seleccione user" value={null} />
        {users.map((user) => (
          <Picker.Item key={user.id} label={user.name} value={user.id} />
        ))}
      </Picker>
      <Text>Selecciona proyecto: </Text>
      <Picker
        selectedValue={selectedProjectId}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedProjectId(itemValue);
        }}
        style={styles.pickerStyle}
      >
        <Picker.Item label="Seleccione proyecto" value={null} />
        {projects.map((project) => (
          <Picker.Item key={project.id} label={project.name} value={project.id} />
        ))}
      </Picker>


{cameraPermissionGranted && (
   <View style={styles.scannerContainer}>
          <BarCodeScanner
            ref={cameraRef}
            style={styles.scanner}
            onBarCodeScanned={handleBarcodeRead}
            
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            
          />
        </View>
)}
      <Button title="Confirmar Entrada" style={styles.btnRegister} onPress={handleConfirm}>
        Confirmar Entrada
      </Button>
    </View>
  ) : (
    <LoginScreen />
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scanner: {
    width: '80%',
    aspectRatio: 1,
  },
  pickerStyle: {
    height: 40,
    width: 300,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 10,
    borderRadius:100,
    backgroundColor: 'white', 
  },
  hora: {
    color: '#EBB61E',
    fontSize: 80,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  viewForm: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  btnRegister: {
    marginTop: 20,
  },
});
