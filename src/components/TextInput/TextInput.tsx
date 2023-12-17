import {
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps,
} from "react-native";

import {FONTS} from "../../constants/fonts";

import {useAppearance} from "../../hooks/useAppearance";

interface Props extends TextInputProps {}

export const TextInput = ({style, ...props}: Props) => {
  const {colors} = useAppearance();

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
