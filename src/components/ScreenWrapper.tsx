import {SafeAreaView, StyleSheet, View} from "react-native";

import {useAppearance} from "../hooks/useAppearance";

interface Props {
  children: React.ReactNode;
}

export const ScreenWrapper = ({children}: Props) => {
  const {colors} = useAppearance();

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
