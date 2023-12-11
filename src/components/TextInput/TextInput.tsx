import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

interface Props extends TextInputProps {}

const styles = StyleSheet.create({
  input: {
    borderColor: COLORS.BLACK,
    borderWidth: 1,
    minHeight: 40,
    padding: 10,
    width: "100%",
    fontFamily: FONTS.POPPINS_REGULAR,
  },
});

export const TextInput = ({ style, ...props }: Props) => {
  return (
    <RNTextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor={COLORS.BLACK}
    />
  );
};
