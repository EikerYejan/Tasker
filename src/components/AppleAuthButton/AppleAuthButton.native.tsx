import {AppleButton} from "@invertase/react-native-apple-authentication";

import {useAppearance} from "../../hooks/useAppearance";

interface Props {
  onPress: () => void;
}

export const AppleAuthButton = ({onPress}: Props) => {
  const {appearance} = useAppearance();

  return (
    <AppleButton
      buttonStyle={
        appearance === "light"
          ? AppleButton.Style.WHITE_OUTLINE
          : AppleButton.Style.DEFAULT
      }
      cornerRadius={0}
      style={{width: 50, height: 50}}
      onPress={onPress}
    />
  );
};
