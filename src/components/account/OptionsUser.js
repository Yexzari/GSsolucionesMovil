import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Icon, ListItem } from "react-native-elements";
import { map } from "lodash";
import Modal from "../common/Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function OptionsUser(props) {
  const { reload } = props;

  const [showModal, setShowModal] = useState(false);
  const [contained, setContained] = useState(null);
  const openClose = () => setShowModal((prevState) => !prevState);
  const selectComponent = (word) => {
    if (word === "name") {
      setContained(<ChangeDisplayNameForm close={openClose} reload={reload} />);
    }
    if (word === "password") {
      setContained(<ChangePasswordForm />);
    }
    openClose();
  };

  const optionsMenu = getOptionsMenu(selectComponent);
  return (
    <View>
      {map(optionsMenu, (menu, index) => (
        <ListItem key={index} onPress={menu.onPress}>
          <Icon
            type={menu.typeIcon}
            name={menu.nameIconLeft}
            color={menu.colorIcon}
          />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type="material-community"
            name={menu.nameIconRight}
            color={menu.colorIconRight}
          />
        </ListItem>
      ))}
      <Modal visible={showModal} close={openClose}>
        {contained}
      </Modal>
    </View>
  );
}

function getOptionsMenu(selectComponent) {
  return [
    {
      title: "Cambiar Nombre",
      typeIcon: "material-community",
      nameIconLeft: "account-circle",
      colorIcon: "#00a680",
      colorIconRight: "#FF2D00",
      nameIconRight: "chevron-right",
      onPress: () => selectComponent("name"),
    },
    {
      title: "Cambiar Contraseña",
      typeIcon: "material-community",
      nameIconLeft: "lock-reset",
      colorIcon: "#00a680",
      colorIconRight: "#FF2D00",
      nameIconRight: "chevron-right",
      onPress: () => selectComponent("password"),
    },
  ];
}
