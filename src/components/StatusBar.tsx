import {useMemo} from "react";
import {StatusBar as RNStatusBar} from "react-native";

import {useAppearance} from "../hooks/useAppearance";

export const StatusBar = () => {
  const {appearance, colors} = useAppearance();

  const barStyle = useMemo(() => {
    return appearance === "dark" ? "light-content" : "dark-content";
  }, [appearance]);

  return (
    <RNStatusBar
      animated
      backgroundColor={colors.background}
      barStyle={barStyle}
    />
  );
};
