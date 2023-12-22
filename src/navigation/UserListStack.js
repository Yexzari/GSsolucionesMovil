import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UsersList from '../screens/UsersList';
import UserDatilsStack from './UserDatilsStack';
import UserDetailsScreen from '../screens/UserDtailsScreen';
const Stack = createNativeStackNavigator();


export default function UserListStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
    name='UserList'
    component={UsersList} //Vista a enseñar , que no sea el mismo
    options={{title:"Info", headerShown:false}}>
    </Stack.Screen>
    <Stack.Screen
        name='UserDtailsScreen'
        component={UserDetailsScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Detalles"}}>
        </Stack.Screen>
</Stack.Navigator>
  )
}