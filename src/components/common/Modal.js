import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'
import React from 'react'


export default function Modal(props) {
    const {visible, close, children} = props;
  return (
    <Overlay
    isVisible={visible}
    onBackdropPress={close}
    overlayStyle={styles.overlay}
    >
        {children}
    </Overlay>
  )
}

const styles = StyleSheet.create({

overlay:{
    height:"auto",
    width:"90%",
    backgroundColor:"#fff",
}
})