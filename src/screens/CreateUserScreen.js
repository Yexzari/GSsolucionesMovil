import React, {useState} from 'react'
import { StyleSheet, TextInput, View,Button, ScrollView} from 'react-native'


function CreateUserScreen(props) {
  const{navigation}=props;
  const [state, setState] = useState({
    name:"",
    date:""
  })
  handleChangeText = (name, value)=>{
    setState({...state,[name]:(value)})
  }
  return (
    <ScrollView style={style.container}>
      <View style={style.inputGroup}>
        <TextInput placeholder='Name user' onChangeText={(value) => handleChangeText('name', value)}></TextInput>
      </View>
      <View style={style.inputGroup}>
        <TextInput placeholder='Hora entrada' onChangeText={(value) => handleChangeText('date', value)}></TextInput>
      </View>
      <View style={style.inputGroup}>
        <Button title='Save User'></Button>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container:{
    flex:1,
    padding:35,
  },
  inputGroup:{
    flex:1,
    padding:0,
    marginBottom:15,
    borderBottomWidth:1,
    borderBottomColor:'#cccccc'
  }
})

export default CreateUserScreen
