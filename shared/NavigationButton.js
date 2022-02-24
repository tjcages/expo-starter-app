import React from "react";
import { StyleSheet } from "react-native";
import { Icon, Button } from "react-native-elements";
import { useThemeColor } from "../components";

const NavigationButton = (props) => {
  const color = useThemeColor({}, "secondary");

  return (
    <Button
      buttonStyle={[styles.button, props.style, props.disabled && { opacity: 0.5 }]}
      icon={<Icon name={props.icon} type="feather" color={color} size={24} />}
      onPress={() => props.onPress()}
      disabled={props.disabled}
      disabledStyle={[styles.button, props.style, props.disabled && { opacity: 0.3 }]}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 0,
    marginRight: 8,
    backgroundColor: "transparent",
  },
});

export default NavigationButton;
