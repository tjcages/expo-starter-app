import React from 'react';
import { TextInput, StyleSheet } from "react-native";
import { useThemeColor } from "./_Theme";
import { Color, Layout, Font } from "../constants";

export const TextField = (props) => {
  const {
    fieldRef,
    style,
    lightColor,
    darkColor,
    icon,
    disabled,
    ...otherProps
  } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );
  const placeholderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );
  const backgroundColor = useThemeColor(
    { light: Color.light.container, dark: Color.dark.highlight },
    "highlight"
  );
  const theme = getTheme();

  return (
    <Container style={[styles.container, { backgroundColor }]}>
      {icon && (
        <Icon
          style={styles.icon}
          name={icon}
          type="feather"
          color={placeholderColor}
          size={Font.size.large}
        />
      )}
      <TextInput
        editable={!disabled}
        ref={fieldRef}
        style={[{ color }, styles.textField, style]}
        placeholderTextColor={placeholderColor}
        keyboardAppearance={theme}
        {...otherProps}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Layout.default.borderRadiusSmall,
  },
  textField: {
    position: "relative",
    flex: 1,
    fontSize: Font.size.medium2,
    borderRadius: Layout.default.borderRadiusSmall,
    paddingTop: Layout.default.medium,
    paddingBottom: Layout.default.medium,
    paddingHorizontal: Layout.default.medium2,
  },
  icon: {
    marginLeft: Layout.default.medium,
  },
});
