import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, where, orderBy, limit, getDocs, updateDoc } from 'firebase/firestore';
import ImagePicker from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar } from 'react-native-elements';


const UserDtailsScreen = (props) => {
  const [userDetails, setUserDetails] = useState(null);
  const [entryTime, setEntryTime] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const db = getFirestore();
      const userId = props.route.params.userId;

      console.log('userId en UserDtailsScreen:', userId);

      if (!userId) {
        console.error('ID de usuario no proporcionado');
        return;
      }

      try {
        // Obtener detalles del usuario
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserDetails(userDocSnap.data());
        } else {
          console.error('Usuario no encontrado');
          return;
        }

        // Obtener la última entrada del usuario
        //const entriesQuery = query(
        //  collection(db, 'entries'),
        //  where('userId', '==', userId),
        //  orderBy('entryTime', 'desc'), // Ordenar por hora de entrada descendente
        //  limit(1) // Obtener solo la última entrada
        //);
        const entriesQuery = query(
          collection(db, 'entries'),
          where('userId', '==', userId)
        );

        const entriesSnapshot = await getDocs(collection(db, 'entries'));
        const userEntries = entriesSnapshot.docs
          .filter((doc) => doc.data().userId === userId)
          .sort((a, b) => b.data().entryTime - a.data().entryTime);

        if (userEntries.length > 0) {
          const latestEntry = userEntries[0].data();
          setEntryTime(latestEntry.entryTime);
          const userPhotoUrl = latestEntry.photo;
          setUserDetails((prevDetails) => ({ ...prevDetails, photo: userPhotoUrl }));
          // Obtener detalles del proyecto asignado
          if (latestEntry.projectId) {
            const projectDocRef = doc(db, 'projects', latestEntry.projectId);
            const projectDocSnap = await getDoc(projectDocRef);

            if (projectDocSnap.exists()) {
              const projectDetails = projectDocSnap.data();
              console.log('Project Name:', projectDetails.name);
              // Actualizar el estado con los detalles del proyecto
              setProjectDetails(projectDetails);
            } else {
              console.error('Proyecto no encontrado');
            }
          }
        } else {
          console.warn('No se encontraron entradas para el usuario');
        }
      } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
      }
    };

    fetchUserDetails();
  }, [props.route.params?.userId]);



  return (
    <View>
      {userDetails && (
        <View>
          {userDetails && (
        <View>
          <Avatar
            rounded
            size="xlarge"
            source={{ uri: userDetails.photo }}
          />
          {/* ... (otros detalles) */}
        </View>
      )}
          <Text>Nombre: {userDetails.name}</Text>
          <Text>Apellido Paterno: {userDetails.lastName}</Text>
          <Text>Apellido Materno: {userDetails.motherLastName}</Text>
          <Text>CURP: {userDetails.curp}</Text>
          <Text>RFC: {userDetails.rfc}</Text>
          <Text>Número de teléfono: {userDetails.phoneNumber}</Text>
          {entryTime && <Text>Entry Time: {entryTime.toDate().toLocaleString()}</Text>}
          {projectDetails && <Text>Project Name: {projectDetails.nameProject}</Text>}
        </View>
      )}
    </View>
  );
};
export default UserDtailsScreen;