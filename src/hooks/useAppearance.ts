import { useColorScheme } from "react-native";
import { useEffect, useMemo } from "react";

import { useAppState } from "../store/store";

import { DarkTheme, LightTheme } from "../constants/themes";

export const useAppearance = () => {
  const { setTheme, state } = useAppState();
  const {
    theme: { setByUser, value: appearance },
  } = state;

  const colorScheme = useColorScheme();

  const toggleAppearance = () => {
    const newAppearance = appearance === "light" ? "dark" : "light";

    setTheme(newAppearance);
  };

  const theme = useMemo(
    () => (appearance === "light" ? LightTheme : DarkTheme),
    [appearance]
  );

  useEffect(() => {
    if (colorScheme !== appearance && !setByUser) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  return {
    appearance,
    colors: theme.colors,
    theme,
    toggleAppearance,
  };
};
