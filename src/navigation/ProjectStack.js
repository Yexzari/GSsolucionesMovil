import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateProjectScreen from '../screens/CreateProjectScreen';


const Stack = createNativeStackNavigator();


export default function ProjectStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
    name='CreateProjectScreen'
    component={CreateProjectScreen} //Vista a enseñar , que no sea el mismo
    options={{title:"Agregar Proyecto ", headerShown:false}}>
    </Stack.Screen>
</Stack.Navigator>
  )
}

