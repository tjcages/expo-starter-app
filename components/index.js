/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  ActivityIndicator as DefaultActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import { StatusBar as DefaultStatusBar } from "expo-status-bar";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import reduxStore from "../store/store";

export function useThemeColor(props, colorName) {
  const theme = getTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export const getTheme = () => {
  const state = reduxStore.store.getState();
  const systemTheme = useColorScheme();
  const theme = state.theme === "system" ? systemTheme : state.theme;
  return theme;
};

// –––– TEXT –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– //

export function Text(props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );

  return (
    <DefaultText
      style={[{ color, fontSize: 16, fontWeight: "400" }, style]}
      {...otherProps}
    />
  );
}

export function Title(props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );

  return (
    <DefaultText
      style={[{ color, fontSize: 28, fontWeight: "600" }, style]}
      {...otherProps}
    />
  );
}

export function Header(props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );

  return (
    <DefaultText
      style={[{ color, fontSize: 22, fontWeight: "600" }, style]}
      {...otherProps}
    />
  );
}

// –––– TEXTFIELDS –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– //

export function TextField(props) {
  const { fieldRef, style, lightColor, darkColor, icon, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );
  const placeholderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );
  const backgroundColor = useThemeColor(
    { light: Colors.light.container, dark: Colors.dark.highlight },
    "highlight"
  );
  const theme = getTheme();

  return (
    <Container style={[fieldStyles.container, { backgroundColor }]}>
      {icon && (
        <Icon
          style={fieldStyles.icon}
          name={icon}
          type="feather"
          color={placeholderColor}
          size={24}
        />
      )}
      <TextInput
        ref={fieldRef}
        style={[{ color }, fieldStyles.textField, style]}
        placeholderTextColor={placeholderColor}
        keyboardAppearance={theme}
        {...otherProps}
      />
    </Container>
  );
}

const fieldStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
  },
  textField: {
    position: "relative",
    flex: 1,
    fontSize: 18,
    borderRadius: 6,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginLeft: 12,
  },
});

// –––– BUTTONS –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– //

export function Button(props) {
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
    textStyle = "primary",
    textColor,
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "mainButton"
  );

  const defaultTextColor =
    textColor ??
    useThemeColor(
      {
        light:
          textStyle === "secondary"
            ? Colors.dark.secondary
            : Colors.dark.primary,
        dark:
          textStyle === "secondary"
            ? Colors.light.secondary
            : Colors.light.primary,
      },
      "primary"
    );

  return (
    <TouchableOpacity
      style={[
        { backgroundColor },
        buttonStyles.button,
        style,
        (disabled || disabledTheme) && { opacity: 0.5 },
        flex && { flex: 1 },
      ]}
      {...otherProps}
      onPress={onPress}
      disabled={disabled}
    >
      <DefaultView style={[buttonStyles.buttonContainer]}>
        {icon && icon}
        <DefaultText
          style={[{ color: defaultTextColor }, buttonStyles.buttonText]}
        >
          {text}
        </DefaultText>
      </DefaultView>
    </TouchableOpacity>
  );
}

export function NavButton(props) {
  const {
    style,
    onPress,
    lightColor = Colors.default.blue,
    darkColor = Colors.default.blue,
    disabled,
    text,
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );

  return (
    <TouchableOpacity
      style={[buttonStyles.navButton, disabled && { opacity: 0.3 }]}
      {...otherProps}
      onPress={onPress}
      disabled={disabled}
    >
      <DefaultText
        style={[
          buttonStyles.buttonText,
          { color: color, fontSize: 20, fontWeight: "400" },
          style,
        ]}
      >
        {text}
      </DefaultText>
    </TouchableOpacity>
  );
}

const buttonStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 24,
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
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});

// –––– VIEWS –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– //

export function View(props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const borderColor = useThemeColor({}, "divider");

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function Container(props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "container"
  );
  const borderColor = useThemeColor({}, "divider");

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function Divider(props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "divider"
  );

  return (
    <View
      style={[{ backgroundColor }, viewStyles.divider, style]}
      {...otherProps}
    />
  );
}

// –––– STYLES ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– //

const viewStyles = StyleSheet.create({
  divider: {
    height: 1,
    marginVertical: 12,
  },
});

export function ActivityIndicator(props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );

  return (
    <DefaultActivityIndicator {...otherProps} size="large" color={color} />
  );
}

export function StatusBar() {
  const theme = getTheme();
  return (
    <DefaultStatusBar
      style={
        Platform.OS === "ios" ? (theme === "dark" ? "light" : "dark") : "auto"
      }
    />
  );
}
