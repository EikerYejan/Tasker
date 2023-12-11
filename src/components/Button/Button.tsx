import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";

interface Props extends TouchableOpacityProps {
  label: string;
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: COLORS.TRANSPARENT,
    borderColor: COLORS.BLACK,
    borderWidth: 1,
    bottom: -8,
    height: 41,
    position: "absolute",
    right: -8,
    width: 220,
  },
  text: {
    color: COLORS.WHITE,
    textAlign: "center",
  },
  wrapper: {
    backgroundColor: COLORS.BLACK,
    borderColor: COLORS.TRANSPARENT,
    borderWidth: 1,
    height: 41,
    paddingHorizontal: 40,
    paddingVertical: 10,
    width: 220,
    marginBottom: 25,
  },
});

export const Button = ({ label, style, ...props }: Props) => {
  return (
    <TouchableOpacity {...props} style={[styles.wrapper, style]}>
      <Text style={styles.text}>{label}</Text>
      <View style={styles.overlay} />
    </TouchableOpacity>
  );
};
