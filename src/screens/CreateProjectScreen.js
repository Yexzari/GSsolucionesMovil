import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView, Alert, Text } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { Input, Button } from 'react-native-elements';
import ButtonFoto from './ButtonFoto';
import ButtonCreate from './ButtonCreate';

const PROJECTS_COLLECTION = 'projects';

const initialState = {
  lider: '',
  nameProject: '',
};

const CreateProjectScreen = (props) => {
  const { navigation } = props;
  const [state, setState] = useState(initialState);

  const resetForm = () => {
    setState(initialState);
  };

  const handleChangeText = (name, value) => {
    const uppercasedValue = ['curp', 'rfc'].includes(name) ? value.toUpperCase() : value;
    setState({ ...state, [name]: uppercasedValue });
  };

  const saveNewProject = async () => {
    const db = getFirestore();

    if (!state.lider || !state.nameProject) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
    } else {
      try {
        await addDoc(collection(db, PROJECTS_COLLECTION), {
          lider: state.lider,
          nameProject: state.nameProject,
        });
        Alert.alert('Éxito', 'Proyecto guardado correctamente');
        resetForm();
        navigation.navigate('ProjectList');
      } catch (error) {
        console.error('Error al guardar el Proyecto:', error);
        Alert.alert('Error', 'Error al guardar el Proyecto. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const loadProjectData = async () => {
    const db = getFirestore();
    const projectCollection = collection(db, PROJECTS_COLLECTION);

    try {
      const querySnapshot = await getDocs(projectCollection);
      querySnapshot.forEach((doc) => {
        console.log('Proyecto cargado:', doc.data());
      });
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.inputGroup}>
        <Text>Nombre del Proyecto:</Text>
        <Input
          placeholder="Ingrese el nombre del proyecto"
          value={state.nameProject}
          onChangeText={(value) => handleChangeText('nameProject', value)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>Líder del Proyecto:</Text>
        <Input
          placeholder="Ingrese el líder del proyecto"
          value={state.lider}
          onChangeText={(value) => handleChangeText('lider', value)}
        />
      </View>
      <Button
        title="Guardar Proyecto"
        onPress={saveNewProject}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  scrollContainer: {
    minHeight: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
});

export default CreateProjectScreen;
