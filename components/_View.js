import { View as DefaultView, StyleSheet } from "react-native";
import { Layout } from "../constants";
import { useThemeColor } from "./_Theme";

export const View = (props) => {
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
};

export const Container = (props) => {
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
};

export const Divider = (props) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "divider"
  );

  return (
    <View
      style={[{ backgroundColor }, styles.divider, style]}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginVertical: Layout.default.medium,
  },
});
