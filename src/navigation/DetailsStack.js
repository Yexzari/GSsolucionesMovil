import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UsersList from '../screens/UsersList';
import CreateUserScreen from '../screens/CreateUserScreen';
import UserDtailsScreen from '../screens/UserDtailsScreen';

const Stack = createNativeStackNavigator();

export default function DetailsStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name='profilesr'
        component={ProfileScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Perfil"}}>
        </Stack.Screen>
        <Stack.Screen
        name='register'
        component={RegisterScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Registrate"}}>
        </Stack.Screen>
        <Stack.Screen
        name='UserList'
        component={UsersList} //Vista a enseñar , que no sea el mismo
        options={{title:"Registrate"}}>
        </Stack.Screen>
        <Stack.Screen
        name='CreateUserScreen'
        component={CreateUserScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Registrate"}}>
        </Stack.Screen>
        <Stack.Screen
        name='UserDtailsScreen'
        component={UserDtailsScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Detalles"}}>
        </Stack.Screen>
    </Stack.Navigator>
  )
}