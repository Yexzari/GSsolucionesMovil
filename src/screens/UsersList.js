import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getFirestore, doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Button, ListItem, Avatar,SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import the icon from Expo vector icons
import ButtonCreate from './ButtonCreate';
import ButtonActualizar from './ButtonActualizar';


const UsersList = (props) => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const db = getFirestore();
      const usersQuerySnapshot = await getDocs(collection(db, 'users'));

      const usersData = [];
      for (const userDoc of usersQuerySnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Obtener la foto del usuario directamente de los datos del usuario
        const userPhoto = userData.photo;
        console.log('User ID:', userId, 'User Photo:', userPhoto);
        // Obtener el proyecto asociado al usuario (si existe)
        const entriesQuery = query(collection(db, 'entries'), where('userId', '==', userId));
        const entriesSnapshot = await getDocs(entriesQuery);

        let projectName = 'No asignado'; // Valor predeterminado si no hay proyecto asignado
        if (!entriesSnapshot.empty) {
          const latestEntry = entriesSnapshot.docs[0].data();
          if (latestEntry.projectId) {
            // Buscar el nombre del proyecto asociado
            const projectDoc = await getDocs(collection(db, 'projects'), where('id', '==', latestEntry.projectId));
            if (!projectDoc.empty) {
              projectName = projectDoc.docs[0].data().nameProject;
            }
          }
        }
        const projectsCountQuery = query(collection(db, 'entries'), where('userId', '==', userId));
        const projectsCountSnapshot = await getDocs(projectsCountQuery);
        const projectCount = projectsCountSnapshot.size;
        usersData.push({
          id: userId,
          name: userData.name,
          lastName:userData.lastName,
          motherLastName:userData.motherLastName,
          date: userData.date,
          projectName: projectName,
          photo: userPhoto,
          projectCount: projectCount,
        });
      }

      setUsers(usersData);
      setUpdateTrigger(prevState => !prevState);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderRightActions = (userId) => (
    <RectButton style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 75 }} onPress={() => deleteUser(userId)}>
      <Text style={{ color: 'white' }}>Eliminar</Text>
    </RectButton>
  );

  const deleteUser = async (userId) => {
    console.log('Deleting user with ID:', userId);

    const db = getFirestore();
    try {
      await deleteDoc(doc(db, 'users', userId));
      console.log('User deleted successfully');
      Alert.alert('Usuario eliminado con éxito');
      fetchUsers();
      // No es necesario llamar a fetchUsers aquí
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Alert.alert('Error', 'Error al eliminar usuario. Por favor, inténtalo de nuevo.');
    }
  };
  const updateUsersList = async () => {
    try {
      console.log('Updating users list...');
      await fetchUsers();
      console.log('Users list updated successfully');
    } catch (error) {
      console.error('Error updating users list:', error);
    }
  };
  return (
    <ScrollView>
<ButtonActualizar onPress={updateUsersList}/>
      {users.map(user => (
        <Swipeable key={user.id} renderRightActions={() => renderRightActions(user.id)}>
          
          <ListItem
            bottomDivider
            onPress={() => {
              console.log('Clic en el usuario:', user.id);
              props.navigation.navigate("UserDtailsScreen", {
                userId: user.id
              });
              console.log(props.navigation);
            }}
          >
            <ListItem.Chevron />
            <Avatar
              size={48}
              rounded
              source={{
                uri: user.photo ? user.photo : "https://example.com/default-photo.jpg",
              }}
              onError={() => console.log('Error cargando la foto del usuario')}
            />
            <ListItem.Content>

            <ListItem.Title>{`${user.name} ${user.lastName} ${user.motherLastName}`}</ListItem.Title>
              <ListItem.Subtitle>{user.date}</ListItem.Subtitle>
              <ListItem.Subtitle>{`Proyectos: ${user.projectCount}`}</ListItem.Subtitle>
              <ListItem.Subtitle>{`Status: Ocupado`}</ListItem.Subtitle>
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
export default UsersList;
