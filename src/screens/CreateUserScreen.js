import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import UsersList from './UsersList';

const initialState = {
  name: '',
  lastName: '',
  motherLastName: '',
  curp: '',
  rfc: '',
  phoneNumber: '',
  photo: null,
};

function CreateUserScreen(props) {
  const { navigation } = props;
  const [state, setState] = useState(initialState);

const resetForm = () => {
  console.log('Reseteando formulario')
    setState(initialState); // Inicializamos directamente el estado
    console.log(initialState);
  };

  const handleChangeText = (name, value) => {
    const uppercasedValue = ['curp', 'rfc'].includes(name) ? value.toUpperCase() : value;
    setState({ ...state, [name]: uppercasedValue });
    
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setState({ ...state, photo: result.assets[0]?.uri });
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  const saveNewUser = async () => {
    const db = getFirestore();

    if (state.name === '') {
      Alert.alert('Error', 'Ingresa nombre');
    } else if (!/^[A-Za-z0-9]{13}$/.test(state.rfc)) {
      Alert.alert('Error', 'RFC debe tener exactamente 13 caracteres alfanuméricos');
    } else {
      try {
        await addDoc(collection(db, 'users'), {
          name: state.name,
          lastName: state.lastName,
          motherLastName: state.motherLastName,
          curp: state.curp,
          rfc: state.rfc,
          phoneNumber: state.phoneNumber,
          photo: state.photo, // Guardamos la URI de la foto
        });
        Alert.alert('Éxito', 'Usuario guardado correctamente');
        resetForm();
        props.navigation.navigate('UserList')
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
        Alert.alert('Error', 'Error al guardar el usuario. Por favor, inténtalo de nuevo.');
      }
    }
  };

  // Función para cargar y traer información de Firebase (ejemplo)
  const loadUserData = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');

    try {
      const querySnapshot = await getDocs(usersCollection);
      querySnapshot.forEach((doc) => {
        console.log('Usuario cargado:', doc.data());
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  // Llamada a la función de carga al cargar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Nombre(s)" value={state.name}
          onChangeText={(value) => handleChangeText('name', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Apellidos" value={state.lastName}
          onChangeText={(value) => handleChangeText('lastName', value)}
        />
      </View>
      <View style={styles.inputGroup}>
  <TextInput
    placeholder="Apellido Materno" value={state.motherLastName}
    onChangeText={(value) => handleChangeText('motherLastName', value)}
  />
</View>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="CURP (opcional)" value={state.curp}
          onChangeText={(value) => handleChangeText('curp', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="RFC (13 dígitos)" value={state.rfc}
          onChangeText={(value) => handleChangeText('rfc', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput 
          placeholder="Número de Teléfono" value={state.phoneNumber}
          onChangeText={(value) => handleChangeText('phoneNumber', value)}
        />
      </View>
      {/* Puedes agregar más TextInput según sea necesario */}

      <Button title="Seleccionar Foto" onPress={pickImage} />
      {state.photo && <Image source={{ uri: state.photo }} style={{ width: 200, height: 200 }} />}
      <Button title="Guardar usuario" onPress={saveNewUser} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default CreateUserScreen;
