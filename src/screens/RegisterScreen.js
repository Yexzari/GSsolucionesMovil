import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native-elements'
import RegisterForm from '../components/account/RegisterForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function RegisterScreen() {
  return (
    <KeyboardAwareScrollView>
      <Image source={require("../../assets/img/logo.png")}
      style={styles.logo}></Image>
      <View style={styles.viewForm}>
        <RegisterForm/>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
    logo:{
      resizeMode:"contain",
      width:"100%",
      height:150,
      marginTop:30,
    },

    viewForm:{
        marginHorizontal:40
    }
  })