import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateUserScreen from '../screens/CreateUserScreen';
const Stack = createNativeStackNavigator();


export default function CreatUserStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
    name='CreateUserScreen'
    component={CreateUserScreen} //Vista a enseñar , que no sea el mismo
    options={{title:"Create Provedor"}}>
    </Stack.Screen>
</Stack.Navigator>
  )
}

