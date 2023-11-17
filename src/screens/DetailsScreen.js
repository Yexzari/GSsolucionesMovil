import { StyleSheet, Text, View,Button} from 'react-native'
import React from 'react'

export default function DetailsScreen(props) {
    const{navigation}=props;
    return (
    <View>
      <Text>DetailsScreen</Text>
      <Button title='Ir a Index' onPress={()=> navigation.navigate("index")}>INDEX</Button>
      <Button title='Ir a Profile' onPress={()=> navigation.navigate("profile")}>Perfil</Button>
    </View>
  )
}

const styles = StyleSheet.create({})