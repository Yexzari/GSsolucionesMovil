import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserDtailsScreen from '../screens/UserDtailsScreen';
import LinearGradient from 'react-native-linear-gradient';
const Stack = createNativeStackNavigator();


export default function UserDatilsStack() {
  return (
    <Stack.Navigator       screenOptions={{
      headerBackground: () => (
        <LinearGradient // Usa LinearGradient para el fondo del encabezado
          colors={['#F7DF2D', '#F23B87']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 4 }}
          end={{ x: 1, y: 1 }}
        />
      ),
      headerTintColor: 'white', // Color del texto del encabezado
      title: 'Detalles',
      headerTitleAlign:"center",
       // Título del encabezado para UserDetailsScreen
    }}>
    <Stack.Screen
    name='UserDtailsScreen'
    component={UserDtailsScreen} //Vista a enseñar , que no sea el mismo
    options={{title:"Detalles",}}>
    </Stack.Screen>
</Stack.Navigator>
  )
}