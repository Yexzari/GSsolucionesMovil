import { Dimensions, StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import { Image } from 'react-native-elements'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import LoginForm from '../components/account/LoginForm';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ScrollView } from "react-native-gesture-handler";
import { BlurView } from 'expo-blur';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { width, height } = Dimensions.get('window')


const uri = "https://i.pinimg.com/originals/69/bb/7e/69bb7ed765264325f6b79782aeffb988.jpg"
export default function LoginScreen() {
  const navigation = useNavigation();
  const irRegistro = () => {
    navigation.navigate("register")
  }

  function SvgTop() {
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={391}
        height={328}
        fill="none"
      >
        <Image source={require("../../assets/img/logo.png")}
          style={styles.logo}></Image>
        <Path
          fill="#E80262"
          fillOpacity={0.53}
          d="M391 49.287H26.4V255.67c170.682 128.629 314.184 53.595 364.6 0V49.287Z"
        />
        <Path
          fill="#E2B412"
          fillOpacity={0.72}
          d="M391 5.67H129.271V302.59c15.976-14.897 59.746-35.752 107.026 0 47.28 35.752 122.835 14.897 154.703 0V5.67Z"
        />
        <Path
          fill="url(#a)"
          d="M391 0H0v302.788c20.547 19.026 86.343 45.661 185.151 0 98.807-45.661 178.402-19.026 205.849 0V0Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={195.5}
            x2={195.5}
            y1={0}
            y2={328}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#FFA133" />
            <Stop offset={1} stopColor="#E20C73" />
          </LinearGradient>
        </Defs>
      </Svg>
    )
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <SvgTop />
          <View style={styles.viewLogin}>
            <LoginForm />
            <Text style={styles.text1}>¿Aún no tienes cuenta?
              <Text style={styles.text2}
                onPress={irRegistro}> Registrate</Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  logo: {
    resizeMode: "contain",
    width: "100%",
    height: 150,
    marginTop: 100
  },
  viewLogin: {
    marginHorizontal: 30
  },
  text1: {
    marginTop: 20,
    marginHorizontal: 50,
    color: 'gray',
  },
  text2: {
    color: "orange",
    fontWeight: "bold"

  },
  container: {
    backgroundColor: "#f1f1f1"
  },
  //image:{
  //  width:'80%',
  //  height:'80%',
  //  resizeMode:'cover',
  //}
})