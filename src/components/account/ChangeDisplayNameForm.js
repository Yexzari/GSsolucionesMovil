import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAuth, updateProfile } from 'firebase/auth';
import Toast from 'react-native-toast-message';

export default function ChangeDisplayNameForm(props) {
  const { close, reload } = props;
  const formik = useFormik({
    initialValues: {
      displayName: '',
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required('Nombre es obligatorio'),
    }),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const user = getAuth().currentUser;
        await updateProfile(user, {
          displayName: formValue.displayName,
        });
        reload();
        close();
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error al actualizar el nombre',
        });
      }
    },
  });

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre" 
        containerStyle={styles.input}
        rightIcon={{
          type: 'material-community',
          name: 'account-circle-outline',
          color: '#c2c2c2',
        }}
        onChangeText={(text) => formik.setFieldValue('displayName', text)}
        errorMessage={formik.errors.displayName}
      />
      <Button
        title="Cambiar Nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
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
