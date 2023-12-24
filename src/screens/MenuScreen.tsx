import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {ScreenWrapper} from "../components/ScreenWrapper";
import {Button} from "../components/Button/Button";

import {useAppearance} from "../hooks/useAppearance";
import {useAppState} from "../store/store";
import {FirestoreService} from "../utils/firestore/firestore";

import {FONTS} from "../constants/fonts";

import type {NavigationProp} from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<any>;
  onClose?: () => void;
}

export const MenuScreen = ({navigation, onClose}: Props) => {
  const {colors} = useAppearance();
  const {
    resetState,
    state: {user},
  } = useAppState();

  const styles = StyleSheet.create({
    option: {
      borderBottomColor: colors.border,
      borderBottomWidth: Platform.OS === "web" ? 0 : 1,
      marginTop: 30,
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
    closeButton: {
      position: "absolute",
      right: 20,
      top: 20,
      zIndex: 1,
    },
  });

  const dbInstanceId = FirestoreService.instanceId;
  const userCreatedAt = new Date(
    Number(user?.metadata.creationTime ?? user?.metadata?.createdAt ?? 0),
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const onCloseButtonPress = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScreenWrapper>
      <TouchableOpacity style={styles.closeButton} onPress={onCloseButtonPress}>
        <Icon name="close-outline" size={35} color={colors.text} />
      </TouchableOpacity>
      <View>
        <Text style={styles.optionTitle}>User Data</Text>
        <Text style={styles.optionText}>UID: {user?.uid}</Text>
        <Text style={styles.optionText}>
          Connected To Database: {String(!!dbInstanceId)}
        </Text>
        <Text style={styles.optionText}>Email: {user?.email ?? "NULL"}</Text>
        <Text style={styles.optionText}>
          Anonymous: {String(user?.isAnonymous ?? "false")}
        </Text>
        <Text style={styles.optionText}>Created At: {userCreatedAt}</Text>
      </View>
      {user && !user?.isAnonymous ? (
        <View style={styles.option}>
          <Button label="Log Out" onPress={resetState} />
        </View>
      ) : (
        <View style={styles.option}>
          <Button
            label="Log In"
            onPress={() => {
              onClose?.();
              navigation.navigate("Login");
            }}
          />
          {__DEV__ ? (
            <Text
              onPress={resetState}
              style={[styles.optionText, {marginBottom: 10}]}>
              Clear App Data
            </Text>
          ) : null}
        </View>
      )}
    </ScreenWrapper>
  );
};
