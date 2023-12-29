import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'; 


export default function ButtonActualizar({ title, onPress, loading }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={loading}>
    <LinearGradient
         colors={['#FFB677', '#FF3CBD']}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 1 }} // Ajusta según sea necesario
         style={styles.button}
     >
       <Feather name="refresh-ccw" size={20} color="white" />
    </LinearGradient>
 </TouchableOpacity>
  )
}

const styles = StyleSheet.create({ 
text:{
    fontSize:16,
    color:'#fff',
    fontWeight:'bold'
},
button:{
    width:"105%",
    height:40,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
},
container:{
    alignItems:'center',
}
})
