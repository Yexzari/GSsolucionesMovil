import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword, reload } from 'firebase/auth';

export default function ChangePasswordForm() {
  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      repeatNewPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Contraseña es obligatoria'),
      newPassword: Yup.string().required('Nueva contraseña es obligatoria'),
      repeatNewPassword: Yup.string()
        .required('Repetir nueva contraseña es obligatoria')
        .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir'),
    }),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const user = getAuth().currentUser;

        // Reautenticar al usuario con su contraseña actual
        const credential = EmailAuthProvider.credential(user.email, formValue.password);
        await reauthenticateWithCredential(user, credential);

        // Cambiar la contraseña
        await updatePassword(user, formValue.newPassword);

        // Recargar el usuario para aplicar los cambios
        await reload(user);

        // Cerrar el formulario o realizar otras acciones necesarias
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Contraseña cambiada',
          text2: 'Tu contraseña se ha actualizado con éxito',
        });
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error al actualizar la contraseña',
          text2: 'Hubo un problema al intentar cambiar la contraseña',
        });
      }
    },
  });

  const [showPass, setShowPass] = useState(false);

  const showPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder='Contraseña actual'
        containerStyle={styles.input}
        secureTextEntry={showPass ? false : true}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        value={formik.values.password}
        errorMessage={formik.touched.password && formik.errors.password}
        rightIcon={{
          type: 'material-community',
          name: showPass ? 'eye-off-outline' : 'eye-outline',
          color: '#c2c2c2',
          onPress: showPassword,
        }}
      />

      <Input
        placeholder='Nueva contraseña'
        containerStyle={styles.input}
        secureTextEntry={true}
        onChangeText={formik.handleChange('newPassword')}
        onBlur={formik.handleBlur('newPassword')}
        value={formik.values.newPassword}
        errorMessage={formik.touched.newPassword && formik.errors.newPassword}
      />

      <Input
        placeholder='Repetir nueva contraseña'
        containerStyle={styles.input}
        secureTextEntry={true}
        onChangeText={formik.handleChange('repeatNewPassword')}
        onBlur={formik.handleBlur('repeatNewPassword')}
        value={formik.values.repeatNewPassword}
        errorMessage={formik.touched.repeatNewPassword && formik.errors.repeatNewPassword}
      />

      <Button
        title='Cambiar Contraseña'
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewForm: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 15,
    width: '95%',
  },
  btn: {
    backgroundColor: '#00a680',
  },
});
