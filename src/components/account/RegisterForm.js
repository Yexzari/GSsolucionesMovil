import { StyleSheet, Text, View } from 'react-native'
import React , {useState} from 'react'
import { Input,Icon,Button } from 'react-native-elements'
import { useFormik } from 'formik'
import * as Yup from "yup";
import {getAuth,createUserWithEmailAndPassword} from "firebase/auth"
import  Toast  from 'react-native-toast-message';
import {useNavigation } from '@react-navigation/native';
import ButtonRegister from './ButtonRegister';
import { ScrollView } from 'react-native-gesture-handler';

export default function RegisterForm() {
const [showPass, setShowPass] = useState(false) //const showPass=false; setShowPass(true)
const navigation = useNavigation();

    const formik = useFormik({
        initialValues:{
            email:"",
            password:"",
            repeatPassword:""
        },
        validateOnChange:false, //Evita evualuar cuando hay un cambio 
        validationSchema:Yup.object({ //VALIDAR DATOS
            email:Yup.string().email("Email invalido").required("OBLIGATORIO"), // QUE SEA STRING ,SEA UN FOrMATO EMAIL, Y SEA OBLIGATORIO
            password:Yup.string().required("Contraseña obligatoria"),
            repeatPassword:Yup.string().required("Verificacion obligatoria") // Contraseña obligatoria y oneOf para verificar que sea la misma que la contraseña 
            .oneOf([Yup.ref("password")],"La contraseña debe coincidir"),
        }),
        onSubmit:async(formValue)=>{
            console.log(formValue)
            try{
                const auth = getAuth()
                await createUserWithEmailAndPassword(
                    auth,
                    formValue.email,
                    formValue.password
                )
                //navigation.navigate("indexS"); // va a una pantalla especifica
                navigation.goBack(""); //regresar a la vista anterio
            }catch(error){
                console.log(error)
                Toast.show({
                    type:"error",
                    position:"bottom",
                    text1:"Error al registrar usuario"
                })
            }
        }
    });

    const showPassword=()=>{
        setShowPass(!showPass)
    }
  return (
    <View style={styles.viewContent}>
      <Input placeholder='E-mail'containerStyle={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }}
      rightIcon={<Icon type='material-community' name='at' iconStyle={styles.icon}/>} //Icono  en la derecha
      onChangeText={text=> formik.setFieldValue("email",text)}// Cachar el texto  , Error por x o y razon 
      errorMessage={formik.errors.email}/> 

      <Input placeholder='Password'containerStyle={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }} secureTextEntry={showPass ? false : true}//Incriptar contraseña, verifica en que estado esta 
      rightIcon={
      <Icon type='material-community'
       name={showPass ? "eye-off-outline" : "eye-outline"} //Dependiendo en que estado esta , pondra el icono
       iconStyle={styles.icon} 
       onPress={showPassword}/> // Llamma a la funcion
        }
      onChangeText={text=> formik.setFieldValue("password",text)}
      errorMessage={formik.errors.password}/>

      <Input placeholder='Corfirm Password'containerStyle={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }}secureTextEntry={true}
      rightIcon={<Icon type='material-community' name='eye' iconStyle={styles.icon}/>}
      onChangeText={text=> formik.setFieldValue("repeatPassword",text)}
      errorMessage={formik.errors.repeatPassword}/>

      <ButtonRegister onPress={formik.handleSubmit}
      loading={formik.isSubmitting}/>
      
    </View>
  )
}

const styles = StyleSheet.create({
    viewContent:{
        marginTop:30,
        marginHorizontal:40,
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
        marginTop:15,
        width:"95%"
    },
    btn:{
        backgroundColor:"purple"
    }
})
