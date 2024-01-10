import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UsersList from '../screens/UsersList';
import UserDetailsScreen from '../screens/UserDtailsScreen';
import ProjectList from '../screens/ProjectList';
const Stack = createNativeStackNavigator();


export default function ProjectListStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
    name='ProyectList'
    component={ProjectList} //Vista a enseñar , que no sea el mismo
    options={{title:"Info", headerShown:false}}>
    </Stack.Screen>
        
</Stack.Navigator>
  )
}