import { StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native'
import React from 'react'
import { Image } from 'react-native-elements'
import RegisterForm from '../components/account/RegisterForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ScrollView } from "react-native-gesture-handler";


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
      fill="#174AFF"
      fillOpacity={0.58}
      d="M391 49.287H26.4V255.67c170.682 128.629 314.184 53.595 364.6 0V49.287Z"
    />
    <Path
      fill="#23B2D1"
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
        <Stop stopColor="#29D1DC" />
        <Stop offset={0.505} stopColor="#196194" />
        <Stop offset={1} stopColor="#080768" />
      </LinearGradient>
    </Defs>
  </Svg>
  )
}
export default function RegisterScreen() {
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
    <View style={styles.viewForm}>
      <SvgTop />
      <RegisterForm />
    </View></KeyboardAwareScrollView></KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  logo: {
    resizeMode: "contain",
    width: "100%",
    height: 150,
    marginTop: 100
  },

  viewForm: {
    backgroundColor: "#f1f1f1"
  },
  scrollViewContent: {
    justifyContent: 'center',
  },
})