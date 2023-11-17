import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import ProfileUser from "../components/account/ProfileUser";
import Loading from "../components/common/Loading";
import OptionsUser from "../components/account/OptionsUser";

export default function ProfileScreen() {
  const [reload, setReload] = useState(false);
  const [visibleLoad, setVisibleLoad] = useState(false);
  const [textLoad, setTextLoad] = useState("");
  const navigation = useNavigation();
  const onReload = () => setReload((prevState) => !prevState);
  console.log("rel -> ",reload)

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigation.navigate("index", { screen: "login" });
  };
  return (
    <View>
      <ProfileUser setVisibleLoad={setVisibleLoad} setTextLoad={setTextLoad} />
      <OptionsUser reload={onReload} />
      <Button
        title="Cerrar sesion"
        onPress={logout}
        style={styles.btn}
        titleStyle={styles.textBtn}
      />
      <Loading visible={visibleLoad} text={textLoad} />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#fff",
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
  },
  textBtn: {
    color: "white",
  },
});
