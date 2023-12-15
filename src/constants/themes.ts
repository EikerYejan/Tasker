import { Theme } from "@react-navigation/native";
import { COLORS } from "./colors";

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: COLORS.BLACK,
    background: COLORS.BLACK,
    card: COLORS.WHITE,
    text: COLORS.WHITE,
    border: COLORS.WHITE,
    notification: COLORS.GREEN,
    primaryInverse: COLORS.WHITE,
  },
};

export const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: COLORS.WHITE,
    background: COLORS.WHITE,
    card: COLORS.BLACK,
    text: COLORS.BLACK,
    border: COLORS.BLACK,
    notification: COLORS.GREEN,
    primaryInverse: COLORS.BLACK,
  },
};
