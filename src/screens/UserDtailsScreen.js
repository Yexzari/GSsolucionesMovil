import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const UserDtailsScreen = (props) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const db = getFirestore();
      const userId = props.route.params?.userId;  // Accede de forma segura a props.route.params.equis
      console.log(props.route.params?.userId);
      console.log(props.route.params?.userId);

      if (!userId) {
        console.error('ID de usuario no proporcionado');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserDetails(userDocSnap.data());
        } else {
          console.error('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
      }
    };

    fetchUserDetails();
  }, [props.route.params?.userId]);  // Asegúrate de incluir props.route.params.equis en la dependencia

  return (
    <View>
      <Text>User Details</Text>
      {userDetails && (
        <View>
          <Text>User ID: {props.route.params?.userId}</Text>
          <Text>Name: {userDetails.name}</Text>
          <Text>Date: {userDetails.date}</Text>
          {/* Agrega más detalles según sea necesario */}
        </View>
      )}
    </View>
  );
};

export default UserDtailsScreen;
