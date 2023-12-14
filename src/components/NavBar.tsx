import { SafeAreaView, StyleSheet, View } from "react-native";

import { COLORS } from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
  },
  safeAreaView: {
    backgroundColor: COLORS.WHITE,
  },
});

export const NavBar = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}></View>
    </SafeAreaView>
  );
};
