import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

interface Props extends TextInputProps {}

export const TextInput = ({ style, ...props }: Props) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    input: {
      borderColor: colors.primaryInverse,
      borderWidth: 1,
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
      minHeight: 40,
      padding: 10,
      width: "100%",
    },
  });

  return (
    <RNTextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor={colors.text}
    />
  );
};
