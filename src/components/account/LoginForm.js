import { StyleSheet, Text, View } from 'react-native'
import React , {useState} from 'react'
import { Input,Icon,Button } from 'react-native-elements'
import * as Yup from "yup";
import { useFormik } from 'formik'
import { getAuth, signInWithEmailAndPassword} from "firebase/auth"
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { async } from '@firebase/util';


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
    <View>
      <Input placeholder='E-mail'containerStyle={styles.input}
      rightIcon={
      <Icon type='material-community' name='at' iconStyle={styles.icon} />} onChangeText={(text)=>formik.setFieldValue("email" ,text)}  
      errorMessage= { formik.errors.email}//Icono  en la derecha
      /> 

      <Input placeholder='Password'containerStyle={styles.input} secureTextEntry={showPass ? false : true}//Incriptar contraseña, verifica en que estado esta 
      rightIcon={
      <Icon type='material-community'
       name={showPass ? "eye-off-outline" : "eye-outline"} //Dependiendo en que estado esta , pondra el icono
       iconStyle={styles.icon} 
       onPress={showPassword}/> // Llamma a la funcion
        } onChangeText={(text)=>formik.setFieldValue("password" ,text)} errorMessage = {formik.errors.password}
      />

      <Button title="Iniciar sesion" containerStyle={styles.btnCotainer} buttonStyle={styles.btn} onPress={formik.handleSubmit} loading={formik.isSubmitting}/>
    </View>
    
  )
}

const styles = StyleSheet.create({ viewContent:{
    marginTop:30
},
input:{
    width:"100%",
    marginTop:15
},
icon:{
    color:"#c1c1c1"
},
btnCotainer:{
    marginTop:15,
    width:"95%"
},
btn:{
    backgroundColor:"#f0a801"
}})