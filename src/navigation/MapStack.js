import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function MapStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name='Map'
        component={MapScreen} //Vista a enseñar , que no sea el mismo
        options={{title:"Map"}}>
        </Stack.Screen>
    </Stack.Navigator>
  )
}