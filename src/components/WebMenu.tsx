import {useEffect} from "react";
import {Modal, Platform, StyleSheet, View} from "react-native";
import {useAppearance} from "../hooks/useAppearance";
import {MenuScreen} from "../screens/MenuScreen";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WebMenu = ({isOpen, onClose}: Props) => {
  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    backdrop: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      padding: 10,
      ...Platform.select({
        web: {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(5px)",
        },
        default: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      }),
    },
    inner: {
      backgroundColor: colors.background,
      borderRadius: 10,
      maxWidth: 640,
      padding: 10,
      paddingBottom: 40,
      width: "100%",
      ...Platform.select({
        web: {
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        },
        default: {},
      }),
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <Modal transparent animationType="fade" visible={isOpen}>
      <View style={styles.backdrop}>
        <View style={styles.inner}>
          <MenuScreen onClose={onClose} />
        </View>
      </View>
    </Modal>
  );
};
