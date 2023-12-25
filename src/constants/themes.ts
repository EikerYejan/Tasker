import {type Theme} from "@react-navigation/native";
import {COLORS} from "./colors";

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    background: COLORS.BLACK,
    border: COLORS.WHITE,
    card: COLORS.WHITE,
    error: COLORS.RED,
    notification: COLORS.GREEN,
    primary: COLORS.BLACK,
    primaryInverse: COLORS.WHITE,
    text: COLORS.WHITE,
  },
};

export const LightTheme: Theme = {
  dark: false,
  colors: {
    background: COLORS.WHITE,
    border: COLORS.BLACK,
    card: COLORS.BLACK,
    error: COLORS.RED,
    notification: COLORS.GREEN,
    primary: COLORS.WHITE,
    primaryInverse: COLORS.BLACK,
    text: COLORS.BLACK,
  },
};
