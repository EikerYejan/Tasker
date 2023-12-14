import { SafeAreaView, StyleSheet, View } from "react-native";

import { COLORS } from "../constants/colors";

interface Props {
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  inner: {
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
});

export const ScreenWrapper = ({ children }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
};
