import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UsersList from '../screens/UsersList';
const Stack = createNativeStackNavigator();


export default function UserListStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
    name='CreateUserScreen'
    component={UsersList} //Vista a enseñar , que no sea el mismo
    options={{title:"Create Provedor"}}>
    </Stack.Screen>
</Stack.Navigator>
  )
}