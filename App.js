import { StatusBar } from 'expo-status-bar';
import "react-native-gesture-handler"
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import { initFirebase } from './src/utils';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';

LogBox.ignoreAllLogs

export default function App() {
  return (
    <>
    <NavigationContainer>
      <AppNavigation></AppNavigation>
    </NavigationContainer>
    <Toast/>
    </>
  );
}

