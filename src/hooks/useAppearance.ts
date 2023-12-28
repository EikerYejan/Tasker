import {type ColorSchemeName, useColorScheme} from "react-native";
import {useEffect, useMemo} from "react";

import {useAppState} from "../store/store";

import {DarkTheme, LightTheme} from "../constants/themes";

export const useAppearance = () => {
  const {setState, state} = useAppState();
  const colorScheme = useColorScheme();

  const appearance = state.theme?.value ?? colorScheme;
  const setByUser = state.theme?.setByUser ?? false;

  const setTheme = (newAppearance: ColorSchemeName, setByUser = false) => {
    setState(state => ({
      ...state,
      theme: {
        ...state.theme,
        value: newAppearance,
        setByUser,
      },
    }));
  };

  const toggleAppearance = () => {
    const newAppearance = appearance === "light" ? "dark" : "light";

    setTheme(newAppearance, true);
  };

  const theme = useMemo(
    () => (appearance === "light" ? LightTheme : DarkTheme),
    [appearance],
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
