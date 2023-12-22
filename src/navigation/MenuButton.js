import { View, Text, Touchable } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from "react-native-elements";
import { StyleSheet } from 'react-native';
const MenuButton = ({ text,type, icon, onPress }) => {
    return (
        <TouchableOpacity
            style={style.buttonContainer}
            onPress={onPress} // Configura la opacidad al presionar
        >
      <Icon type={type} name={icon} style={style.icon} color="white" />
            <Text style={{color:"white", fontSize:18}}>{text}</Text>
        </TouchableOpacity>

    )
}
const style = StyleSheet.create({
    buttonContainer: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: "#00E3A60F",
        marginVertical: 10,
        borderColor: "#fff",
        borderWidth:1,
        height:70
    },
    icon: {
        marginRight: 8,
        color:"white"
    },
})
export default MenuButton