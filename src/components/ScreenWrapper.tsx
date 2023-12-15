import { SafeAreaView, StyleSheet, View } from "react-native";

import { useTheme } from "@react-navigation/native";

interface Props {
  children: React.ReactNode;
}

export const ScreenWrapper = ({ children }: Props) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    inner: {
      padding: 20,
      paddingBottom: 0,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
};
