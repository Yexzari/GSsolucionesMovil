import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Avatar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card  } from 'react-native-paper';


const UserDetailsScreen = (props) => {
  const [userDetails, setUserDetails] = useState(null);
  const [entryTime, setEntryTime] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const db = getFirestore();
      const userId = props.route.params.userId;
      console.log('ID de usuario:', userId);

      if (!userId) {
        console.error('ID de usuario no proporcionado');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.error('Usuario no encontrado');
          return;
        }

        setUserDetails(userDocSnap.data());
        console.log('Detalles del usuario:', userDetails);
        const entriesQuery = query(
          collection(db, 'entries'),
          where('userId', '==', userId)
        );

        const entriesSnapshot = await getDocs(entriesQuery);
        console.log('Entradas de la colección:', entriesSnapshot.docs);

        const userProjects = [...new Set(entriesSnapshot.docs.map((doc) => doc.data().projectId).filter(Boolean))];
        console.log('Proyectos:', userProjects);

        setProjects(userProjects);
        // Actualizar el estado userEntries
        const entries = entriesSnapshot.docs
          .filter((doc) => doc.data().userId === userId)
          .sort((a, b) => b.data().entryTime - a.data().entryTime);

        if (entries.length > 0) {
          const latestEntry = entries[0].data();
          setEntryTime(latestEntry.entryTime);
        } else {
          console.warn('No se encontraron entradas para el usuario');
        }

        // Actualizar el estado userEntries con las entradas filtradas
        setEntryTime(entries);
        console.log('Entradas de tiempo:', entryTime);

        // Actualizar el estado projectDetails

        const projectsDetailsPromises = userProjects.map(async (projectId) => {
          const projectDocRef = doc(db, 'projects', projectId);

          try {
            const projectDocSnap = await getDoc(projectDocRef);

            if (projectDocSnap.exists()) {
              const projectData = projectDocSnap.data();
              const projectName = projectData.nameProject || 'Nombre no disponible';
              return { id: projectId, name: projectName };
            } else {
              console.error(`Detalles del proyecto no encontrados para el ID: ${projectId}`);
              return null;
            }
          } catch (error) {
            console.error(`Error al buscar detalles del proyecto para el ID: ${projectId}`, error);
            return null;
          }
        });

        const projectsDetails = await Promise.all(projectsDetailsPromises);
        setProjectDetails(projectsDetails.filter(Boolean));
        console.log('Details Projects:', projectsDetails);



      } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [props.route.params?.userId]);

  return (
    <ScrollView>
      <View>
        {isLoading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          userDetails && (
            <View style={styles.container}>
              <View style={styles.avatarContainer}>
                <Avatar
                  rounded
                  size="xlarge"
                  source={{ uri: userDetails?.photo }}
                  onLoad={() => console.log('Image loaded successfully')}
                  onError={(e) => console.log('Error loading image', e.nativeEvent.error)}
                />
              </View>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.text}>{`${userDetails.name} ${userDetails.lastName} ${userDetails.motherLastName}`}</Text>
              <Card>
                <Card.Title title="Nombre" subtitle="Card Subtitle"  />
                <Card.Content>
                  <Text variant="titleLarge">Card title</Text>
                  <Text variant="bodyMedium">Card content</Text>
                </Card.Content>
                <Card.Actions>
                  <Button>Cancel</Button>
                  <Button>Ok</Button>
                </Card.Actions>
              </Card>
              <Text style={styles.label}>CURP:</Text>
              <Text style={styles.text}>{userDetails.curp}</Text>
              <Text style={styles.label}>RFC:</Text>
              <Text style={styles.text}>{userDetails.rfc}</Text>
              <Text style={styles.label}>Número de teléfono:</Text>
              <Text style={styles.text}>{userDetails.phoneNumber}</Text>
              {entryTime.length > 0 && (
                <View>
                  <Text style={styles.label}>Entradas del usuario:</Text>
                  {entryTime.map((entry, index) => (
                    <View key={index}>
                      <Text style={styles.label}>Proyecto:</Text>
                      {projectDetails.length > 0 && entry.data().projectId && (
                        projectDetails.map((project) => {

                          if (project.id === entry.data().projectId) {
                            console.log(`Encontrado nombre del proyecto para ${entry.data().projectId}: ${project.name}`);
                            return (
                              <View key={project.id}>
                                <Text style={styles.text}>{project.name}</Text>
                              </View>
                            );
                          }
                          return null;
                        })
                      )}
                      <Text style={styles.label}>Fecha y hora de Registro:</Text>
                      <Text style={styles.text}>
                        {entry.data().entryTime?.seconds &&
                          new Date(entry.data().entryTime.seconds * 1000).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
        )}

      </View>

    </ScrollView>
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
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetailsScreen;
