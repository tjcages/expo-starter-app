import React from 'react';
import { Text as DefaultText } from "react-native";
import { Font } from "../constants";
import { useThemeColor } from "./_Theme";

export const Text = (props) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );

  return (
    <DefaultText
      style={[
        { color, fontSize: Font.size.medium, fontWeight: Font.weight.regular },
        style,
      ]}
      {...otherProps}
    />
  );
};

export const Title = (props) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );

  return (
    <DefaultText
      style={[
        {
          color,
          fontSize: Font.size.medium2,
          fontWeight: Font.weight.semiBold,
        },
        style,
      ]}
      {...otherProps}
    />
  );
};

export const Header = (props) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );

  return (
    <DefaultText
      style={[
        { color, fontSize: Font.size.large, fontWeight: Font.weight.semiBold },
        style,
      ]}
      {...otherProps}
    />
  );
};
