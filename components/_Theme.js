import React from 'react';
import { Appearance } from "react-native"
import reduxStore from "../store/store";
import { Color } from "../constants";

export const getTheme = () => {
  // get theme from redux persist store
  const state = reduxStore.store.getState();
  // get system theme
  const systemTheme = Appearance.getColorScheme();
  // if saved theme exists, use that, otherwise default to system theme
  const theme = state.theme === "system" ? systemTheme : state.theme;
  return theme;
};

export const useThemeColor = (props, colorName) => {
  // get theme
  const theme = getTheme();
  // apply color scheme based on selected theme
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Color[theme][colorName];
  }
}