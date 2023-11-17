import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name='profile'
        component={ProfileScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Perfil"}}>
        </Stack.Screen>
    </Stack.Navigator>
  )
}