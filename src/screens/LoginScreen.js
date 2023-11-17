import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native-elements'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import LoginForm from '../components/account/LoginForm';

export default function LoginScreen() {
  const navigation = useNavigation();
  const irRegistro =() =>{
    navigation.navigate("register")
  }

  return (
    <View>
      <Image source={require("../../assets/img/logo.png")}
      style={styles.logo}></Image>
      <View style={styles.viewLogin}>
        <LoginForm/>
        <Text style={styles.text1}>¿Aún no tienes cuenta? 
          <Text style={styles.text2}
          onPress={irRegistro}> Registrate</Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  logo:{
    resizeMode:"contain",
    width:"100%",
    height:150,
    marginTop:30
  },
  viewLogin:{
    marginHorizontal:30
  },
  text1:{
    marginTop:15,
    marginHorizontal:10
  },
  text2:{
    color:"orange",
    fontWeight:"bold"

  }
})