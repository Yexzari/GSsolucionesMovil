import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Avatar, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfileUser(props) {
  // console.log(props)
  const {setVisibleLoad, setTextLoad} = props;
  const { uid, photoURL, displayName, email } = getAuth().currentUser;
  const [photo, setPhoto] = useState(photoURL);
  console.log(displayName)

  const changePhoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!resultado.canceled) uploadPhoto(resultado.uri);
  };

  const uploadPhoto = async (uri) => {
    setTextLoad("Actualizando foto de perfil");
    setVisibleLoad(true);
    //console.log(uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const refStorage = ref(storage, `imgProfile/${uid}`);
    uploadBytes(refStorage, blob).then((snapshot) => {
      updateProfilePicture(snapshot.metadata.fullPath);
    });
  };

  const updateProfilePicture = async (imgPath) => {
    setTextLoad("Actualizando foto de perfil");
    const storage = getStorage();
    const imgRef = ref(storage, imgPath);
    const imgUrl = await getDownloadURL(imgRef);
    console.log("urlImg-> " + imgUrl);
    const auth = getAuth();
    updateProfile(auth.currentUser, { photoURL: imgUrl });
    setPhoto(imgUrl);
    setVisibleLoad(false);
  };
  console.log("otro->",photo)

  return (
    <View style={styles.viewInfo}>
    <Avatar
      size={250}  // Ajusta el tamaño de la imagen
      containerStyle={styles.avatar}
      source={{ uri: photo }}
    >
      <Avatar.Accessory size={40} onPress={changePhoto} />
    </Avatar>
    <View style={styles.userInfo}>
      <Text style={styles.user}>{displayName || "Anonimo"}</Text>
      <Text>{email}</Text>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
viewInfo: {
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column", // Cambiado a columna para apilar los elementos verticalmente
  backgroundColor: "#f2f2f2",
  paddingVertical: 30,
},
avatar: {
  backgroundColor: "#faad07",
  borderRadius: 10, // Ajusta el radio del borde para que la imagen sea cuadrada
  overflow: "hidden", // Para asegurarte de que la imagen no se salga del área cuadrada
  marginBottom: 10, // Espaciado inferior para separar la imagen del texto
},
userInfo: {
  alignItems: "center", // Centra el texto horizontalmente
},
user: {
  fontWeight: "bold",
  paddingBottom: 5,
  fontSize:15
},
});