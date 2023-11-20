import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, ScrollView, Alert } from 'react-native';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

function CreateUserScreen(props) {
  const { navigation } = props;
  const [state, setState] = useState({
    name: '',
    date: '',
  });

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const saveNewUser = async () => {
    const db = getFirestore();

    if (state.name === '') {
      Alert.alert('Error', 'Ingresa nombre');
    } else {
      try {
        await addDoc(collection(db, 'users'), {
          name: state.name,
          date: state.date,
        });
        Alert.alert('Éxito', 'Usuario guardado correctamente');
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
          placeholder="Nombre de usuario"
          onChangeText={(value) => handleChangeText('name', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Hora de entrada"
          onChangeText={(value) => handleChangeText('date', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Button title="Guardar usuario" onPress={() => saveNewUser()} />
      </View>
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
