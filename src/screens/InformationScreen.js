import { StyleSheet, Text, View,Button } from 'react-native'
import React from 'react'

export default function InformationScreen(props) {
    const{navigation}=props;
  return (
    <View>
      <Text>InformationScreen</Text>
      <Button title='Ir a detalles' onPress={()=> navigation.navigate("details")}>DETALLES</Button>
    </View>
  )
}

const styles = StyleSheet.create({})