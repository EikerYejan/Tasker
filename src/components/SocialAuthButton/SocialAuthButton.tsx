import {StyleSheet, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {useAppearance} from "../../hooks/useAppearance";

import {SocialLoginProvider} from "../../types";

interface SocialAuthButtonProps {
  onPress: () => void;
  provider: SocialLoginProvider;
}

export const SocialAuthButton = ({
  onPress,
  provider,
}: SocialAuthButtonProps) => {
  const iconNames = {
    [SocialLoginProvider.APPLE]: "logo-apple",
    [SocialLoginProvider.GOOGLE]: "logo-google",
  };

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
      <Icon name={iconNames[provider]} size={25} color={colors.text} />
    </TouchableOpacity>
  );
};
