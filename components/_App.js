import React from 'react';
import {
  ActivityIndicator as DefaultActivityIndicator,
  RefreshControl as DefaultRefreshControl,
} from "react-native";
import { StatusBar as DefaultStatusBar } from "expo-status-bar";
import { useThemeColor, getTheme } from "./_Theme";

export const ActivityIndicator = (props) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );

  return (
    <DefaultActivityIndicator {...otherProps} size="large" color={color} />
  );
};

export const RefreshControl = (props) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary"
  );

  return (
    <DefaultRefreshControl
      {...otherProps}
      size="large"
      color={[color]}
      tintColor={color}
    />
  );
};

export const StatusBar = () => {
  const theme = getTheme();
  return (
    <DefaultStatusBar
      style={
        Platform.OS === "ios" ? (theme === "dark" ? "light" : "dark") : "auto"
      }
    />
  );
};
