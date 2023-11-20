import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView} from 'react-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { Button, ListItem, Avatar } from 'react-native-elements';

const UsersList = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, 'users'), (querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const {name,date}=doc.data();
        userList.push({
          id:doc.id,
          name,
          date
        });
      });
      setUsers(userList);
    });
 
    // Función de limpieza para cancelar la suscripción cuando el componente se desmonta 
    return () => unsubscribe();
  }, []);

  return (
   // <View>
    //  <Text>Lista de usuarios</Text>
    //  {users.map((user, index) => (
      //  <Text key={index}>{JSON.stringify(user)}</Text>
    //  ))}
  //  </View>
  <ScrollView>
      <Button title="CreateProvedor" onPress={() => props.navigation.navigate("CreateUserScreen")} />
      {
        users.map(user=>{
          return(
            <ListItem key={user.id} bottomDivider onPress={()=> {
              props.navigation.navigate("UserDetailsScreen", {
                  userId: user.id
              });
            }}>
              <ListItem.Chevron/>
              <Avatar size={32} rounded source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}/> 
              <ListItem.Content>
                <ListItem.Title>{user.name}</ListItem.Title>
                <ListItem.Title>{user.date}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )
        })
      }
  </ScrollView>
  );
};

export default UsersList;
