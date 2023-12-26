import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import IndexStack from "./IndexStack";
import ProfileStack from "./ProfileStack";
import CreatUserStack from "./CreatUserStack";
import UserListStack from "./UserListStack";
import LoginStack from "./LoginStack";
import { Dimensions } from 'react-native'; // Agrega esta importación al principio de tu archivo
import { StyleSheet } from "react-native";
import { Text,View } from "react-native-elements";
import MenuButton from "./MenuButton";

const Drawer = createDrawerNavigator();

const headerBackground = () => (
  <LinearGradient
    colors={['#F7DF2D', '#F23B87']}
    style={{ flex: 1 }}
    start={{ x: 0, y: 4 }}
    end={{ x: 1, y: 1 }}
  />
);

const GradientBackground = ({ children }) => (
  <LinearGradient
    colors={['#FFD353', '#F23B87']}
    style={{ flex: 1 }}
    start={{ x: 1, y: 1 }}
    end={{ x: 1, y: 0 }}
  >
    {children}
  </LinearGradient>
);

const DrawerContent = ({ navigation }) => {
  return (
    <GradientBackground>
      <DrawerContentScrollView style={styles.container}>
        <Text style={styles.title}>Menú</Text>
        <MenuButton text="Inicio"
          type="material-community" icon="home-edit-outline" 
          onPress={() => navigation.navigate("Inicio")}></MenuButton>
          <Text style={{marginTop:25, marginBottom:10, fontWeight:"bold", color:"white"}}>Operativos</Text>
          <MenuButton text="Operativos"
             type="material-community" icon="account-group-outline" 
          onPress={() => navigation.navigate("UserList")}></MenuButton>
          <MenuButton text="Agregar Operativo"
           type="material-community" icon="account-plus-outline" 
          onPress={() => navigation.navigate("CreateUserScreen")}></MenuButton>
          <MenuButton text="Perfil"
        type="material-community" icon="account"
          onPress={() => navigation.navigate("Profile")}></MenuButton>
        <Text style={{marginTop:25, marginBottom:10, fontWeight:"bold", color:"white"}}>Proyectos</Text>
          <MenuButton text="Proyectos"
             type="material-community" icon="account-group-outline" ></MenuButton>
          <MenuButton text="Agregar Proyecto"
           type="material-community" icon="account-plus-outline"></MenuButton>
      </DrawerContentScrollView>
    </GradientBackground>
  );
};

export default function AppNavigation() {
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setSesion(user ? true : false);
    });
  }, []);

  return sesion ? (
    <Drawer.Navigator
      screenOptions={{
        headerBackground: headerBackground,
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitleStyle: {
            fontStyle: 'italic',  // cursiva
            fontWeight: 'bold',   // negrita
          },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerStyle={{
        width: Dimensions.get('window').width * 0.95, // Utiliza Dimensions para obtener la anchura de la ventana
      }}
    >
    
      <Drawer.Screen name="Inicio" component={IndexStack} />
      <Drawer.Screen name="UserList" component={UserListStack} options={{ title: "Operativos" }} />
      <Drawer.Screen name="CreateUserScreen" component={CreatUserStack} options={{ title: "Agregar usuario" }} />
      <Drawer.Screen name="Profile" component={ProfileStack} options={{ title: "Perfil" }} />
      
    </Drawer.Navigator>
  ) : (
    <LoginStack />
  );
}
const styles = StyleSheet.create({
    container:{
        padding:15,

    },
    title:{
        fontSize:20,
        fontWeight:'bold',
        marginBottom:20,
        color: 'white',
    }
})