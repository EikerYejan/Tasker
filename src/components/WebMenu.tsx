import {Modal, StyleSheet, View} from "react-native";
import {useAppearance} from "../hooks/useAppearance";
import {MenuScreen} from "../screens/MenuScreen";
import {useNavigation} from "@react-navigation/native";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WebMenu = ({isOpen, onClose}: Props) => {
  const navigation = useNavigation<any>();

  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    backdrop: {
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      flex: 1,
      justifyContent: "center",
      padding: 10,
    },
    inner: {
      backgroundColor: colors.background,
      borderRadius: 10,
      maxWidth: 640,
      padding: 10,
      paddingBottom: 40,
      width: "100%",
    },
  });

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.inner}>
          <MenuScreen navigation={navigation} onClose={onClose} />
        </View>
      </View>
    </Modal>
  );
};
