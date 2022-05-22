import React from "react";
import {
  Text as DefaultText,
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const outputRange = [1, 0.9];
  const scale = animation.interpolate({ inputRange, outputRange });

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      {...otherProps}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <Animated.View
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
          { transform: [{ scale }], opacity: scale },
        ]}
      >
        <View style={[styles.buttonContainer]}>
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
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
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
    justifyContent: "center",
    paddingVertical: Layout.default.medium2,
    paddingHorizontal: Layout.default.large,
    borderRadius: Layout.default.borderRounded,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 10,
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
