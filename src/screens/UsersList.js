import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getFirestore, doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Button, ListItem, Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { Alert } from 'react-native';

const UsersList = (props) => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

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

      usersData.push({
        id: userId,
        name: userData.name,
        date: userData.date,
        projectName: projectName,
        photo: userPhoto,
      });
    }

    setUsers(usersData);
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
      await fetchUsers(); // Llama a la función fetchUsers para actualizar la lista
      console.log('Users list updated successfully');
    } catch (error) {
      console.error('Error updating users list:', error);
    }
  };
  return (
    <ScrollView>
      <Button title="Create User" onPress={() => props.navigation.navigate("CreateUserScreen")} />
      <Button title="Update List" onPress={updateUsersList} />
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
            <Avatar size={32} rounded source={{ uri: user.photo }} />
            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
              <ListItem.Subtitle>{user.date}</ListItem.Subtitle>
              <ListItem.Subtitle>{`Proyecto: ${user.projectName}`}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </Swipeable>
      ))}
    </ScrollView>
  );
};

export default UsersList;
