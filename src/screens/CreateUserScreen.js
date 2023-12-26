import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { Input } from 'react-native-elements';
import ButtonFoto from './ButtonFoto';
import ButtonCreate from './ButtonCreate';

const initialState = {
  name: '',
  lastName: '',
  motherLastName: '',
  curp: '',
  rfc: '',
  phoneNumber: '',
  photo: null,
};

const CreateUserScreen = (props) => {
  const { navigation } = props;
  const [state, setState] = useState(initialState);

  const resetForm = () => {
    setState(initialState);
  };
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setScrollViewHeight(contentHeight);
  };
  const handleChangeText = (name, value) => {
    const uppercasedValue = ['curp', 'rfc'].includes(name) ? value.toUpperCase() : value;
    setState({ ...state, [name]: uppercasedValue });
  };

  const uploadPhoto = async (uri) => {
    const storage = getStorage();
    const imageRef = ref(storage, 'user_photos/' + new Date().toISOString());

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
      setState({ ...state, photo: imageUrl });
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        uploadPhoto(result.uri);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  const saveNewUser = async () => {
    const db = getFirestore();

    if (!state.name || !state.lastName || !state.motherLastName || !state.rfc || !state.phoneNumber) {
      Alert.alert('Error', 'Nombre, RFC y Número de Teléfono son campos obligatorios');
    } else if (!/^[A-Za-z0-9]{13}$/.test(state.rfc)) {
      Alert.alert('Error', 'RFC debe tener exactamente 13 caracteres alfanuméricos');
    } else {
      try {
        await addDoc(collection(db, 'users'), {
          name: state.name,
          lastName: state.lastName,
          motherLastName: state.motherLastName,
          curp: state.curp || '',
          rfc: state.rfc,
          phoneNumber: state.phoneNumber,
          photo: state.photo || null,
        });
        Alert.alert('Éxito', 'Usuario guardado correctamente');
        resetForm();
        navigation.navigate('UserList');
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
        Alert.alert('Error', 'Error al guardar el usuario. Por favor, inténtalo de nuevo.');
      }
    }
  };

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

  useEffect(() => {
    loadUserData();
  }, []);

  return (
        <ScrollView
      style={styles.container}
      onContentSizeChange={handleContentSizeChange}
      contentContainerStyle={{ minHeight: scrollViewHeight }}
    >
      <View style={styles.inputGroup}>
        <Input
          placeholder="Nombre(s)" value={state.name}inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={styles.inputText}
          onChangeText={(value) => handleChangeText('name', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Input
          placeholder="Apellido Paterno" value={state.lastName}inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={styles.inputText}
          onChangeText={(value) => handleChangeText('lastName', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Input
          placeholder="Apellido Materno" value={state.motherLastName}inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={styles.inputText}
          onChangeText={(value) => handleChangeText('motherLastName', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Input
          placeholder="CURP (Opcional)" value={state.curp}inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={styles.inputText}
          onChangeText={(value) => handleChangeText('curp', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Input
          placeholder="RFC (13 dígitos)" value={state.rfc}inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={styles.inputText}
          onChangeText={(value) => handleChangeText('rfc', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Input
          placeholder="Número de Teléfono" value={state.phoneNumber}inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={styles.inputText}
          onChangeText={(value) => handleChangeText('phoneNumber', value)}
        />
      </View>
      {/* Puedes agregar más TextInput según sea necesario */}
      <ButtonFoto title="Seleccionar Foto"  onPress={pickImage} />
      {state.photo && <Image source={{ uri: state.photo }} style={{ width: 150, height: 150,alignSelf: 'center', }} />}
      <ButtonCreate title="Guardar usuario" onPress={saveNewUser}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    width:"100%",
    marginBottom:30,
    borderColor:'gray',
    borderRadius:30,
    height:45,
    backgroundColor:"#fff",
    fontSize:15,
    paddingStart:30, 
    color:'grey'
  },
  inputText:{
    fontSize:15,
  }
});

export default CreateUserScreen;
