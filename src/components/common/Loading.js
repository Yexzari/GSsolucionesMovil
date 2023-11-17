import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Overlay } from 'react-native-elements'

export default function Loading(props) {
    const {visible, text} = props;
  return (
    <Overlay isVisible={visible} overlayStyle={styles.overlay}>
        <View style={styles.viewText}>
            <ActivityIndicator size="large" color="pink" />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    </Overlay>
  )
}

Loading.defaultProps={
    visible:false
}

const styles = StyleSheet.create({
    overlay:{
        height:100,
        width:200,
        backgroundColor:"#fff",
        borderColor:"pink",
        borderWidth:2,
        borderRadius:10
    },
    viewText:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    text:{
        color:"pink",
        textTransform:"uppercase",
        marginTop:10
        }

})