import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import IndexScreen from '../screens/IndexScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, { Path, Defs, Stop } from 'react-native-svg';


const Stack = createNativeStackNavigator();

export default function IndexStack() {

  return (
    <Stack.Navigator>
      <Stack.Screen name='index' component={IndexScreen} options={{ headerShown: false }}/>
      {/* Otras pantallas */}
    </Stack.Navigator>
  )
}

