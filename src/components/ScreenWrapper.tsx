import { SafeAreaView, StyleSheet } from "react-native";

import { COLORS } from "../constants/colors";

interface Props {
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
  },
});

export const ScreenWrapper = ({ children }: Props) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};
