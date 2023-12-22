import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name='profile'
        component={ProfileScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Perfil", headerShown:false}}>
        </Stack.Screen>
        <Stack.Screen
        name='login'
        component={LoginScreen}
        options={{ headerShown: false }}>
      </Stack.Screen>
    </Stack.Navigator>
  )
}