import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

export default function ButtonLogin({ title, onPress, loading }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={loading}>
    <LinearGradient
         colors={['#FFB677', '#FF3CBD']}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 1 }} // Ajusta según sea necesario
         style={styles.button}
     >
       <Text style={styles.text}>Iniciar sesión</Text>
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
    width:"80%",
    height:50,
    borderRadius:25,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
},
container:{
    alignItems:'center',
    marginTop:60,
}
})
