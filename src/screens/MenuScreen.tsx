import {StyleSheet, Text, View} from "react-native";

import {ScreenWrapper} from "../components/ScreenWrapper";
import {Button} from "../components/Button/Button";
import {useAppearance} from "../hooks/useAppearance";
import {FONTS} from "../constants/fonts";
import {useAppState} from "../store/store";

export const MenuScreen = () => {
  const {colors} = useAppearance();
  const {
    resetState,
    state: {user},
  } = useAppState();

  const styles = StyleSheet.create({
    option: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    optionTitle: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 40,
    },
    optionText: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
      fontSize: 16,
      marginBottom: 8,
    },
  });

  return (
    <ScreenWrapper>
      <View>
        <Text style={styles.optionTitle}>User Data</Text>
        <Text style={styles.optionText}>UID: {user?.uid}</Text>
        <Text style={styles.optionText}>Email: {user?.email ?? "NULL"}</Text>
        <Text style={styles.optionText}>
          Display Name: {user?.displayName ?? "NULL"}
        </Text>
        <Text style={styles.optionText}>
          Created At:{" "}
          {new Date(user?.metadata.creationTime ?? "").toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            },
          )}
        </Text>
      </View>
      <View style={styles.option}>
        <Text style={styles.optionTitle}>Debug Options</Text>
        <Button label="Clear App Storage" onPress={resetState} />
      </View>
    </ScreenWrapper>
  );
};
