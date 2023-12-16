import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

import { useAppearance } from "../../hooks/useAppearance";

interface Props extends TouchableOpacityProps {
  label: string;
}

export const Button = ({ disabled, label, style, ...props }: Props) => {
  const { colors } = useAppearance();

  const styles = StyleSheet.create({
    disabledButton: {
      opacity: 0.35,
    },
    overlay: {
      backgroundColor: COLORS.TRANSPARENT,
      borderColor: colors.border,
      borderWidth: 1,
      bottom: -8,
      height: 41,
      position: "absolute",
      right: -8,
      width: 220,
    },
    text: {
      color: colors.primary,
      fontFamily: FONTS.POPPINS_REGULAR,
      fontWeight: "400",
      textAlign: "center",
    },
    wrapper: {
      backgroundColor: colors.primaryInverse,
      borderColor: COLORS.TRANSPARENT,
      borderWidth: 1,
      height: 41,
      paddingHorizontal: 40,
      paddingVertical: 10,
      width: 220,
      marginBottom: 25,
    },
  });

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[styles.wrapper, style, disabled ? styles.disabledButton : {}]}
    >
      <Text style={styles.text}>{label}</Text>
      <View style={styles.overlay} />
    </TouchableOpacity>
  );
};
