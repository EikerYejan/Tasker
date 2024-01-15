import {Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {router} from "expo-router";

import {useAppearance} from "../hooks/useAppearance";

export const HeaderBackButton = () => {
  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    inner: {
      alignItems: "center",
      flexDirection: "row",
      height: 50,
      justifyContent: "flex-start",
      paddingLeft: 10,
      ...Platform.select({
        web: {
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 1420,
          width: "100%",
        },
        native: {},
      }),
    },
  });

  const onBackPress = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={onBackPress}>
          <Icon color={colors.text} name="chevron-back-outline" size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
