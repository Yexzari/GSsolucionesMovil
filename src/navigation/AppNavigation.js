import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DetailsScreen from "../screens/DetailsScreen";

import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from "../screens/ProfileScreen";
import IndexScreen from "../screens/IndexScreen";
import IndexStack from "./IndexStack";
import DetailsStack from "./DetailsStack";
import ProfileStack from "./ProfileStack";
import { Icon } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UsersList from "../screens/UsersList";
import CreateUserScreen from "../screens/CreateUserScreen";
import CreatUserStack from "./CreatUserStack";
import UserDatilsStack from "./UserDatilsStack";

// const Drawer = createDrawerNavigator();

// export default function AppNavigation(){
//          return(
//             <Drawer.Navigator>
//                 <Drawer.Screen name="index" component={IndexScreen} options={{title: "index"}}></Drawer.Screen>
//                 <Drawer.Screen name="details" component={DetailsScreen} options={{title: "details"}}></Drawer.Screen>
//                 <Drawer.Screen name="information" component={InformationScreen} options={{title: "Information"}}></Drawer.Screen>
//              </Drawer.Navigator>
//          )
//      }

const Tab = createBottomTabNavigator();

export default function AppNavigation(){
    const [sesion,setSesion] = useState(null);
  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user)=>{
     setSesion(user ? true : false);
    })
  },[]);

    return sesion ? (
        <Tab.Navigator screenOptions={({route})=>({title: "index", headerShown:false, tabBarActiveTintColor:"red", 
        tabBarInactiveTintColor:"green", tabBarIcon:({color, size})=>(iconos(route, color, size))})}>
            <Tab.Screen 
            name="index" component={IndexStack}>   
            </Tab.Screen>
             <Tab.Screen 
             name="details" component={DetailsStack} options={{title: "Status",headerShown:false}}>
             </Tab.Screen>
            <Tab.Screen 
            name="profile" component={ProfileStack} options={{title: "Perfil",headerShown:false}}>
            </Tab.Screen>
            <Tab.Screen 
            name="CreateUserScreen" component={CreatUserStack} options={{title: "UserList",headerShown:false}}>
            </Tab.Screen>
            <Tab.Screen 
            name="userDtails" component={UserDatilsStack} options={{title: "Info",headerShown:false}}>
            </Tab.Screen>
            
            {/* <Tab.Screen 
            name="profile" component={ProfileScreen} options={{title: "Perfil"}}>
            </Tab.Screen> */}
        </Tab.Navigator>
    ) : (
        <IndexStack/>
    )
}

function iconos (route, color, size){
    let name;
    if(route.name===`index`){
        name = "home-outline";
    }
    if(route.name===`details`){
        name = "details";
    }
    if(route.name===`profile`){
        name = "account";
    }
    return<Icon type="material-community" 
    name={name} 
    color={color} 
    size={size}/>
    }

// const Stack = createNativeStackNavigator();

// export default function AppNavigation(){
//     return(
//         <Stack.Navigator>
//             <Stack.Screen name="index" component={IndexScreen} options={{title: "index"}}></Stack.Screen>
//             <Stack.Screen name="details" component={DetailsScreen} options={{title: "details"}}></Stack.Screen>
//             <Stack.Screen name="information" component={InformationScreen} options={{title: "Information"}}></Stack.Screen>

//     </Stack.Navigator>
//     )
// }
