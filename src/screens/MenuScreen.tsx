import {useMemo} from "react";
import {Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {ScreenWrapper} from "../components/ScreenWrapper";
import {Button} from "../components/Button/Button";

import {useAppearance} from "../hooks/useAppearance";
import {useAppState} from "../store/store";
import {FirestoreService} from "../utils/firestore/firestore";
import {AuthService} from "../utils/auth/auth";
import {Alert} from "../utils/alert/alert";

import {FONTS} from "../constants/fonts";
import {PRIVACY_POLICIY_URL, TERMS_OF_SERVICE_URL} from "../constants/urls";

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
    deleteAccount: {
      color: colors.error,
      fontFamily: FONTS.POPPINS_BOLD,
      fontWeight: "bold",
    },
    option: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
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

  const userCreatedAt = useMemo(() => {
    const dateString = user?.metadata.creationTime ?? user?.metadata?.createdAt;
    const timestamp = Number(dateString);

    if (!dateString) return null;

    return new Date(
      isNaN(timestamp) ? dateString : timestamp,
    ).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }, [user?.metadata]);

  const onCloseButtonPress = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  const onDeleteScreen = () => {
    const alertTitle = "Are you sure you want to delete your account?";

    const deleteAccount = async () => {
      await FirestoreService.deleteDocument();
      await AuthService.deleteUser();

      resetState();
    };

    Alert.alert(alertTitle, "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: deleteAccount,
        style: "destructive",
      },
    ]);
  };

  const onPrivacyPolicyPress = () => {
    Linking.openURL(PRIVACY_POLICIY_URL);
  };

  const onTermsAndConditionsPress = () => {
    Linking.openURL(TERMS_OF_SERVICE_URL);
  };

  const dev = process.env.NODE_ENV === "development";

  return (
    <ScreenWrapper>
      <TouchableOpacity style={styles.closeButton} onPress={onCloseButtonPress}>
        <Icon name="close-outline" size={35} color={colors.text} />
      </TouchableOpacity>
      <View>
        <Text style={styles.optionTitle}>User Data</Text>
        <Text style={styles.optionText}>UID: {user?.uid}</Text>
        <Text style={styles.optionText}>
          Connected To Database: {Boolean(dbInstanceId).toString()}
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
          {!user?.isAnonymous && (
            <Text
              onPress={onDeleteScreen}
              style={[styles.optionText, styles.deleteAccount]}>
              Delete Account
            </Text>
          )}
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
          {dev ? (
            <Text
              onPress={resetState}
              style={[styles.optionText, {marginBottom: 10}]}>
              Clear App Data
            </Text>
          ) : null}
        </View>
      )}
      <TouchableOpacity onPress={onPrivacyPolicyPress}>
        <Text style={[styles.optionText, {marginTop: 10}]}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onTermsAndConditionsPress}>
        <Text style={styles.optionText}>Terms & Conditions</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};
