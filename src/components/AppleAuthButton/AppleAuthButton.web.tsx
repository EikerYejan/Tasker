import {StyleSheet, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {useAppearance} from "../../hooks/useAppearance";

interface Props {
  onPress: () => void;
}

export const AppleAuthButton = ({onPress}: Props) => {
  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: "transparent",
      borderColor: colors.text,
      borderWidth: 1,
      flexDirection: "row",
      height: 50,
      justifyContent: "center",
      width: 50,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name="logo-apple" size={25} color={colors.text} />
    </TouchableOpacity>
  );
};
