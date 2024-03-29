import React, { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import LoginScreen from './LoginScreen';
import Loading from '../components/common/Loading';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import ButtonRegistro from './ButtonRegistro';
import Checkbox from 'expo-checkbox';



export default function IndexScreen(props) {
  const [isChecked, setChecked] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
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
  const [firstCheckboxDisabled, setFirstCheckboxDisabled] = useState(false); 


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
        const projectEntryRef = collection(db, 'entries');
        const companyEntryRef = collection(db, 'registroEntries');

        // Verificar si el usuario ya tiene un registro de entrada a la empresa
        const existingCompanyEntryQuery = query(companyEntryRef, where('userId', '==', selectedUser.id));
        const existingCompanyEntrySnapshot = await getDocs(existingCompanyEntryQuery);

        if (existingCompanyEntrySnapshot.size === 0) {
          // Si no hay registro de entrada a la empresa, registrarlo
          const entryTimeToCompany = new Date();
          const entryDateToCompany = entryTimeToCompany.toISOString().split('T')[0];
          const entryDataToCompany = {
            userId: selectedUser.id,
            entryTime: serverTimestamp(),
            entryDate: entryDateToCompany,
          };
          await addDoc(companyEntryRef, entryDataToCompany);

          console.log('Entrada a la empresa registrada en Firebase.');
        }

        // Verificar si el usuario ya está registrado en el proyecto seleccionado
        const existingProjectEntryQuery = query(projectEntryRef, where('userId', '==', selectedUser.id), where('projectId', '==', selectedProjectId));
        const existingProjectEntrySnapshot = await getDocs(existingProjectEntryQuery);

        if (!existingProjectEntrySnapshot.empty) {
          // El usuario ya está registrado en este proyecto
          Alert.alert('Advertencia', 'Este usuario ya está registrado en este proyecto.');
          return;
        }

        // Obtener la fecha y hora actual
        const entryTimeToProject = new Date();
        const entryDateToProject = entryTimeToProject.toISOString().split('T')[0];

        // Registrar la entrada al proyecto
        const entryDataToProject = {
          userId: selectedUser.id,
          projectId: selectedProjectId,
          entryTime: serverTimestamp(),
          entryDate: entryDateToProject,
        };
        await addDoc(projectEntryRef, entryDataToProject);

        // Obtener el nombre del proyecto en la lista de proyectos
        const selectedProject = projects.find((project) => project.id === selectedProjectId);
        const projectName = selectedProject ? selectedProject.name : 'Desconocido';

        // Mostrar alert con detalles
        const formattedTimeToProject = entryTimeToProject.toLocaleTimeString();
        const formattedDateToProject = entryDateToProject;
        const alertMessage = `Usuario: ${selectedUser.name}\nFecha registrada en el proyecto: ${formattedDateToProject}\nHora registrada en el proyecto: ${formattedTimeToProject}\nProyecto asignado: ${projectName}`;
        Alert.alert('Entrada Registrada', alertMessage);

        // Verificar si el usuario tiene un registro en registroEntries
        const hasCompanyEntry = existingCompanyEntrySnapshot.size > 0;
        setChecked(hasCompanyEntry); // Marcar o desmarcar el checkbox según tenga o no un registro en registroEntries

      } catch (error) {
        console.error('Error al registrar la entrada:', error);
      } finally {
        setSelectedUser(null);
        setSelectedProjectId(null);
        setIsScanning(true);
      }
    } else {
      Alert.alert('Por favor, selecciona un usuario y un proyecto antes de confirmar la entrada.');
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
  function SvgTop(){
    const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const svgWidth = screenWidth;
  const svgHeight = (screenWidth / 390) * 144; 

    return(

      <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={svgWidth}
      height={svgHeight}
      fill="none"
    >
      <Path
        fill="#E80262"
        fillOpacity={0.53}
        d="M354 100.5c-78.8 51.6-167.5 43.167-202 32.5V61.5L354 55v45.5Z"
      />
      <Path
        fill="#E2B412"
        fillOpacity={0.72}
        d="M389.5 116.5c-81.6 42.8-148.667 10.167-172-11.5V46h172v70.5Z"
      />
      <Path
        fill="url(#a)"
        d="M198.5 113C90.5 166.6 21.167 138.667 0 118V0h390v116.5c-74-39.6-158.5-18.833-191.5-3.5Z"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={390}
          x2={0}
          y1={42.5}
          y2={42.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F23B87" />
          <Stop offset={0} stopColor="#F23B87" />
          <Stop offset={0.646} stopColor="#F47E62" />
          <Stop offset={1} stopColor="#F2B743" />
        </LinearGradient>
      </Defs>
    </Svg>
    )
  }
  
  return sesion ? (
    <View style={styles.viewForm}>
      <View style={styles.topContainer}>
      <SvgTop style={styles.sv} />
        <Text style={{ ...styles.hora, fontSize: 100,position: 'absolute',}}>
          {currentTime}
        </Text>
      </View>
      
      <View style={styles.section}>
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={setChecked}
        disabled={firstCheckboxDisabled}
      />
      <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
      <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
      <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
    </View>
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
      <ButtonRegistro title="Confirmar Entrada" style={styles.btnRegister} onPress={handleConfirm}></ButtonRegistro>  
    </View>
  ) : (
    <LoginScreen />
  );
}

const styles = StyleSheet.create({

  scannerContainer: {
    
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  scanner: {
    width: '80%',
    aspectRatio: 1,
  },
  pickerStyle: {
    height: 30,
    width: 250,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 30,
    overflow: 'hidden', // Añade esta línea
  },
  hora: {
    color: '#fff',
    fontSize: 80,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  viewForm: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#E7E7E7",
  },
  btnRegister: {
    marginBottom: 10,
  },
  topContainer: {
    marginTop:0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: 'row',
    alignItems:'center',

  },
  paragraph: {
    fontSize: 10,
  },
  checkbox: {
    width: 25, 
  height: 25,
  marginHorizontal:25,
    color:'blue'
  },
});
