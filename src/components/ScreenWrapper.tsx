import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {useAppearance} from "../hooks/useAppearance";

interface Props {
  children: React.ReactNode;
}

const {height} = Dimensions.get("window");

export const ScreenWrapper = ({children}: Props) => {
  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    inner: {
      flex: 1,
      minHeight: height,
      padding: 20,
      paddingBottom: 0,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};
