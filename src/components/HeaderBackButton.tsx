import {TouchableOpacity, StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";

import {useAppearance} from "../hooks/useAppearance";

import type {UseNavigation} from "../types";

export const HeaderBackButton = () => {
  const navigation = useNavigation<UseNavigation>();
  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: colors.overlay,
      borderBottomWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      height: 50,
      justifyContent: "flex-start",
      paddingLeft: 10,
    },
  });

  const onBackPress = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress}>
        <Icon color={colors.text} name="chevron-back-outline" size={25} />
      </TouchableOpacity>
    </View>
  );
};
