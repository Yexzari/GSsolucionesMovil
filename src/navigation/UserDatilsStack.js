import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserDtailsScreen from '../screens/UserDtailsScreen';
const Stack = createNativeStackNavigator();


export default function UserDatilsStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
    name='UserDtailsScreen'
    component={UserDtailsScreen} //Vista a enseñar , que no sea el mismo
    options={{title:"Detalles"}}>
    </Stack.Screen>
</Stack.Navigator>
  )
}