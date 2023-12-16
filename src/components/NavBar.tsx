import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppearance } from "../hooks/useAppearance";
import { useTheme } from "@react-navigation/native";

export const NavBar = () => {
  const { toggleAppearance } = useAppearance();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingRight: 10,
    },
    safeAreaView: {
      backgroundColor: colors.background,
    },
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleAppearance}>
          <Text>Change Theme</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
