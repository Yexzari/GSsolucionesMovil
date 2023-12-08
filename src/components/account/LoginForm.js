import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React , {useState} from 'react'
import { Input,Icon,Button } from 'react-native-elements'
import * as Yup from "yup";
import { useFormik } from 'formik'
import { getAuth, signInWithEmailAndPassword} from "firebase/auth"
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { async } from '@firebase/util';
import { setStatusBarStyle } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonLogin from './ButtonLogin';



export default function LoginForm() {
    const [showPass, setShowPass] = useState(false) //const showPass=false; setShowPass(true)
    const navigation = useNavigation();
    const showPassword=()=>{
        setShowPass(!showPass)
    }
    const formik = useFormik({
        initialValues:{
            email:"",
            password:""
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email, no valido").required("El email es obligatorio"),
            password: Yup.string().required("La contraseña es obligatoria")

        }),
        validateOnChange:false,
        onSubmit :async (formValue) =>{
           try {  
            const auth = getAuth();
             await signInWithEmailAndPassword(auth,formValue.email,formValue.password);
              navigation.navigate("indexs")
           } catch (error) {
            Toast.show({
                type:"error",
                position:"bottom",
                text1:"Usuario o contraseña incorrectos",

            })
            
           }
                }
    })
  return (
    <View >
      <Input placeholder='Correo'containerStyle={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }}
      rightIcon={
      <Icon type='material-community' name='at' iconStyle={styles.icon} />} onChangeText={(text)=>formik.setFieldValue("email" ,text)}  
      errorMessage= { formik.errors.email}
      /> 

      <Input placeholder='Contraseña'containerStyle={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }} secureTextEntry={showPass ? false : true}//Incriptar contraseña, verifica en que estado esta 
      rightIcon={
      <Icon type='material-community'
       name={showPass ? "eye-off-outline" : "eye-outline"} //Dependiendo en que estado esta , pondra el icono
       iconStyle={styles.icon} 
       onPress={showPassword}/> // Llamma a la funcion
        } onChangeText={(text)=>formik.setFieldValue("password" ,text)} errorMessage = {formik.errors.password}
      />
       
      <ButtonLogin title="Iniciar sesion" onPress={formik.handleSubmit} loading={formik.isSubmitting}/>
    </View>
    
  )
}

const styles = StyleSheet.create({ viewContent:{
    marginTop:30
},
input:{
    width:"100%",
    marginTop:40,
    borderColor:'gray',
    borderRadius:30,
    height:50,
    backgroundColor:"#fff",
    fontSize:30,
    paddingStart:30,
    color:'grey'
},
icon:{
    color:"#c1c1c1"
},
btnCotainer:{
    marginTop:50,
    width:"95%",
    alignContent:"center"
},
btn:{
    backgroundColor:"#f0a801",
    
},
})