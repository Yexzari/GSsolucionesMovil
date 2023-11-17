import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import IndexScreen from '../screens/IndexScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function IndexStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name='indexs'
        component={IndexScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Indexs"}}>
        </Stack.Screen>
        <Stack.Screen
        name='login'
        component={LoginScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Iniciar Sesion"}}>
        </Stack.Screen>
        <Stack.Screen
        name='register'
        component={RegisterScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Registrate"}}>
        </Stack.Screen>
        {/* <Stack.Screen
        name='profile'
        component={ProfileScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Perfil"}}>
        </Stack.Screen> */}
        
    </Stack.Navigator>
  )
}