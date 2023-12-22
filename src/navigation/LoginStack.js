import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import IndexScreen from '../screens/IndexScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function LoginStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name='login'
        component={LoginScreen}
        options={{ headerShown: false }}>
      </Stack.Screen>
        <Stack.Screen
        name='register'
        component={RegisterScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Registrate",headerShown:false}}>
        </Stack.Screen>
        <Stack.Screen
        name='index'
        component={IndexScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Inicio"}} >
        </Stack.Screen>
        {/* <Stack.Screen
        name='profile'
        component={ProfileScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Perfil"}}>
        </Stack.Screen> */}
        
    </Stack.Navigator>
  )
}