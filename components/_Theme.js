import React, { useEffect } from "react";
import Chroma from "chroma-js";
import TimerMixin from "react-timer-mixin";

// Components
import { Appearance } from "react-native";
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
};

// Gradients
const TOP_COLORS = [
  "#02F950",
  "#03CBA2",
  "#EFD82A",
  "#5E60CE",
  "#80FFDB",
  "#FF5D8F",
  "#02F950",
];
const BOTTOM_COLORS = [
  "#03CBA2",
  "#FF5D8F",
  "#EF6A2A",
  "#EB1E4E",
  "#5E60CE",
  "#64DFDF",
  "#03CBA2",
];
const GRADIENT_COLOR_LENGTH = 400;
const TOP_COLORS_SPECTRUM = Chroma.scale(TOP_COLORS).colors(
  GRADIENT_COLOR_LENGTH
);
const BOTTOM_COLORS_SPECTRUM = Chroma.scale(BOTTOM_COLORS).colors(
  GRADIENT_COLOR_LENGTH
);
const INTERVAL = 100;

var gradient = {
  topIndex: 0,
  bottomIndex: 0,
  colorTop: TOP_COLORS_SPECTRUM[0],
  colorBottom: BOTTOM_COLORS_SPECTRUM[0],
};

export const getGradientColor = () => {

  useEffect(() => {
    TimerMixin.setInterval(() => {
      let { topIndex, bottomIndex } = gradient;

      topIndex++;
      if (topIndex === TOP_COLORS_SPECTRUM.length) {
        topIndex = 0;
      }

      bottomIndex++;
      if (bottomIndex === BOTTOM_COLORS_SPECTRUM.length) {
        bottomIndex = 0;
      }

      gradient = {
        topIndex: topIndex,
        bottomIndex: bottomIndex,
        colorTop: TOP_COLORS_SPECTRUM[topIndex],
        colorBottom: BOTTOM_COLORS_SPECTRUM[bottomIndex],
      }
      // setGradient({
        // topIndex: topIndex,
        // bottomIndex: bottomIndex,
        // colorTop: TOP_COLORS_SPECTRUM[topIndex],
        // colorBottom: BOTTOM_COLORS_SPECTRUM[bottomIndex],
      // });
    }, INTERVAL);
  }, []);

  return gradient
};
