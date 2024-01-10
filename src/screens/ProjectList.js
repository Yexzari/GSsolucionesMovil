import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { getFirestore, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { Button, ListItem, Avatar, SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ButtonActualizar from './ButtonActualizar';

const DELETE_ACTION_COLOR = 'red';

const ProjectList = (props) => {
  const [projects, setProjects] = useState([]);
  const navigation = useNavigation();
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      const db = getFirestore();
      const projectsQuerySnapshot = await getDocs(collection(db, 'projects'));

      const projectList = [];
      projectsQuerySnapshot.forEach((doc) => {
        const { nameProject } = doc.data();
        projectList.push({
          id: doc.id,
          name: nameProject, // assuming the field is named nameProject
        });
      });
      setProjects(projectList);
      setUpdateTrigger((prevState) => !prevState);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const renderRightActions = (projectId) => (
    <RectButton style={{ backgroundColor: DELETE_ACTION_COLOR, justifyContent: 'center', alignItems: 'center', width: 75 }} onPress={() => deleteProject(projectId)}>
      <Text style={{ color: 'white' }}>Eliminar</Text>
    </RectButton>
  );

  const deleteProject = async (projectId) => {
    console.log('Deleting project with ID:', projectId);

    const db = getFirestore();
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      console.log('Project deleted successfully');
      Alert.alert('Proyecto eliminado con éxito');
      fetchProjects();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      Alert.alert('Error', 'Error al eliminar proyecto. Por favor, inténtalo de nuevo.');
    }
  };

  const updateProjectsList = async () => {
    try {
      console.log('Updating projects list...');
      await fetchProjects();
      console.log('Projects list updated successfully');
    } catch (error) {
      console.error('Error updating projects list:', error);
    }
  };

  return (
    <ScrollView>
      <ButtonActualizar onPress={updateProjectsList} />
      {projects.map((project) => (
        <Swipeable key={project.id} renderRightActions={() => renderRightActions(project.id)}>
          <ListItem
            bottomDivider
            onPress={() => {
              console.log('Click en el proyecto:', project.id);
              props.navigation.navigate('ProjectDetailsScreen', {
                projectId: project.id,
              });
            }}
          >
            <ListItem.Chevron />
            <ListItem.Content>
              <ListItem.Title>{`${project.name} `}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Swipeable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: 10, // Espacio entre ListItems
  },
  separator: {
    height: 10, // Espacio entre ListItems
  },
});

export default ProjectList;
