import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserDtailsScreen from '../screens/UserDtailsScreen';
const Stack = createNativeStackNavigator();


export default function UserDatilsStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
    name='UserDetailsScreen'
    component={UserDtailsScreen} //Vista a enseñar , que no sea el mismo
    options={{title:"Info"}}>
    </Stack.Screen>
</Stack.Navigator>
  )
}