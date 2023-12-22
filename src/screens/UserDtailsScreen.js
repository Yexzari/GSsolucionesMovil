import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Avatar } from 'react-native-elements';

const UserDetailsScreen = (props) => {
  const [userDetails, setUserDetails] = useState(null);
  const [entryTime, setEntryTime] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const db = getFirestore();
      const userId = props.route.params.userId;

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
          return;
        }

        const entriesQuery = query(
          collection(db, 'entries'),
          where('userId', '==', userId)
        );

        const entriesSnapshot = await getDocs(entriesQuery);
        const userEntries = entriesSnapshot.docs
          .filter((doc) => doc.data().userId === userId)
          .sort((a, b) => b.data().entryTime - a.data().entryTime);

        if (userEntries.length > 0) {
          const latestEntry = userEntries[0].data();
          setEntryTime(latestEntry.entryTime);

          if (latestEntry.projectId) {
            const projectDocRef = doc(db, 'projects', latestEntry.projectId);
            const projectDocSnap = await getDoc(projectDocRef);

            if (projectDocSnap.exists()) {
              const projectDetails = projectDocSnap.data();
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
      } finally {
        // Marcar isLoading como falso después de que se complete la carga
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [props.route.params?.userId]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setUserDetails((prevDetails) => ({ ...prevDetails, photo: result.uri }));
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  console.log('URL de la imagen:', userDetails?.photo);

  return (
    <View>
      {isLoading }
      {userDetails && (
        <View>
          <Avatar
  rounded
  size="xlarge"
  source={{ uri: userDetails?.photo }}
  onLoad={() => console.log('Image loaded successfully')}
  onError={(e) => console.log('Error loading image', e.nativeEvent.error)}
/>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.text}>{userDetails.name}</Text>
        <Text style={styles.label}>Apellido Paterno:</Text>
        <Text style={styles.text}>{userDetails.lastName}</Text>
        <Text style={styles.label}>Apellido Materno:</Text>
        <Text style={styles.text}>{userDetails.motherLastName}</Text>
        <Text style={styles.label}>CURP:</Text>
        <Text style={styles.text}>{userDetails.curp}</Text>
        <Text style={styles.label}>RFC:</Text>
        <Text style={styles.text}>{userDetails.rfc}</Text>
        <Text style={styles.label}>Número de teléfono:</Text>
        <Text style={styles.text}>{userDetails.phoneNumber}</Text>
        {entryTime && <Text style={styles.label}>Fecha y hora de Registro:</Text>}
        {entryTime && <Text style={styles.text}>{entryTime.toDate().toLocaleString()}</Text>}
        {projectDetails && <Text style={styles.label}>Project Name:</Text>}
        {projectDetails && <Text style={styles.text}>{projectDetails.nameProject}</Text>}
      </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    marginTop: 5,
  },
});
export default UserDetailsScreen;
