import {StyleSheet, Text, View} from "react-native";

import {ScreenWrapper} from "../components/ScreenWrapper";
import {Button} from "../components/Button/Button";
import {useAppearance} from "../hooks/useAppearance";
import {FONTS} from "../constants/fonts";
import {useAppState} from "../store/store";

export const MenuScreen = () => {
  const {colors} = useAppearance();
  const {resetState} = useAppState();

  const styles = StyleSheet.create({
    option: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    optionTitle: {
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 40,
    },
  });

  return (
    <ScreenWrapper>
      <View style={styles.option}>
        <Text style={styles.optionTitle}>Debug Options</Text>
        <Button label="Clear App Storage" onPress={resetState} />
      </View>
    </ScreenWrapper>
  );
};
