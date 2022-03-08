import React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon, Button as DefaultButton } from "react-native-elements";
import { Color, Layout, Font } from "../constants";
import { useThemeColor } from "./_Theme";

export const Button = (props) => {
  const {
    style,
    onPress,
    lightColor,
    darkColor,
    disabled,
    disabledTheme,
    text,
    icon,
    flex,
    inverted,
    textStyle = "primary",
    textColor,
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "mainButton"
  );
  const backgroundColor2 = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const defaultTextColor =
    textColor ??
    useThemeColor(
      {
        light:
          textStyle === "secondary" ? Color.dark.secondary : Color.dark.primary,
        dark:
          textStyle === "secondary"
            ? Color.light.secondary
            : Color.light.primary,
      },
      "primary"
    );
  const primary = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );
  const divider = useThemeColor({}, "highlight");

  return (
    <TouchableOpacity
      style={[
        { backgroundColor },
        inverted && {
          backgroundColor: backgroundColor2,
          borderColor: divider,
          borderWidth: 1,
        },
        styles.button,
        style,
        (disabled || disabledTheme) && { opacity: 0.5 },
        flex && { flex: 1 },
      ]}
      {...otherProps}
      onPress={onPress}
      disabled={disabled}
    >
      <DefaultView style={[styles.buttonContainer]}>
        {icon && icon}
        <DefaultText
          style={[
            { color: defaultTextColor },
            inverted && { color: primary },
            styles.buttonText,
          ]}
        >
          {text}
        </DefaultText>
      </DefaultView>
    </TouchableOpacity>
  );
};

export const NavButton = (props) => {
  const {
    style,
    icon,
    onPress,
    lightColor = Color.default.blue,
    darkColor = Color.default.blue,
    disabled,
    text,
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );

  return icon ? (
    <DefaultButton
      buttonStyle={[
        styles.navButton,
        props.style,
        props.disabled && { opacity: 0.5 },
      ]}
      icon={
        <Icon
          name={props.icon}
          type="feather"
          color={color}
          size={Layout.default.large}
        />
      }
      onPress={() => props.onPress()}
      disabled={props.disabled}
      disabledStyle={[
        styles.button,
        props.style,
        props.disabled && { opacity: 0.3 },
      ]}
    />
  ) : (
    <TouchableOpacity
      style={[styles.navButton, disabled && { opacity: 0.3 }]}
      {...otherProps}
      onPress={onPress}
      disabled={disabled}
    >
      <DefaultText
        style={[
          styles.buttonText,
          {
            color: color,
            fontSize: Font.size.medium2,
            fontWeight: Font.weight.regular,
          },
          style,
        ]}
      >
        {text}
      </DefaultText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    borderRadius: Layout.default.borderRadius,
    paddingVertical: Layout.default.medium2,
    paddingHorizontal: Layout.default.large,
    justifyContent: "center",
  },
  navButton: {
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: Font.size.medium2,
    fontWeight: Font.weight.semiBold,
    textAlign: "center",
  },
  navButton: {
    padding: Layout.default.small,
    backgroundColor: "transparent",
  },
});
