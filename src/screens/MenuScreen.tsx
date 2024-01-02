import {useMemo} from "react";
import {Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useTranslation} from "react-i18next";

import {ScreenWrapper} from "../components/ScreenWrapper";
import {Button} from "../components/Button/Button";

import {useAppearance} from "../hooks/useAppearance";
import {useAppState} from "../store/store";
import {FirestoreService} from "../utils/firestore/firestore";
import {AuthService} from "../utils/auth/auth";
import {i18nService} from "../utils/i18n/i18nService";
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

  const {t} = useTranslation();

  const styles = StyleSheet.create({
    deleteAccount: {
      color: colors.error,
      fontFamily: FONTS.POPPINS_BOLD,
      fontWeight: "bold",
      marginTop: 20,
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
    link: {
      alignSelf: "flex-start",
    },
  });

  const dbInstanceId = FirestoreService.instanceId;

  const userCreatedAt = useMemo(() => {
    const dateString = user?.metadata.creationTime ?? user?.metadata?.createdAt;
    const timestamp = Number(dateString);

    if (!dateString) return null;

    return i18nService.parseDate(isNaN(timestamp) ? dateString : timestamp, {
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
    const deleteAccount = async () => {
      await FirestoreService.deleteDocument();
      await AuthService.deleteUser();

      resetState();
    };

    Alert.alert(t("menu.alert.deleteAccount"), "", [
      {
        text: t("alert.cancel"),
        style: "cancel",
      },
      {
        text: t("alert.delete"),
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
    <ScreenWrapper disableLocaleChanger>
      <TouchableOpacity style={styles.closeButton} onPress={onCloseButtonPress}>
        <Icon name="close-outline" size={35} color={colors.text} />
      </TouchableOpacity>
      <View>
        <Text style={styles.optionTitle}>{t("menu.title")}</Text>
        <Text style={styles.optionText}>UID: {user?.uid}</Text>
        <Text style={styles.optionText}>
          {t("menu.connected")} {Boolean(dbInstanceId).toString()}
        </Text>
        <Text style={styles.optionText}>Email: {user?.email ?? "NULL"}</Text>
        <Text style={styles.optionText}>
          {t("menu.anonymous")} {String(user?.isAnonymous ?? "false")}
        </Text>
        <Text style={styles.optionText}>
          {t("menu.createdAt")} {userCreatedAt}
        </Text>
      </View>
      {user && !user?.isAnonymous ? (
        <View style={styles.option}>
          <Button label={t("menu.logout")} onPress={resetState} />
        </View>
      ) : (
        <View style={styles.option}>
          <Button
            label={t("menu.login")}
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
      {!user?.isAnonymous && (
        <TouchableOpacity
          style={[styles.deleteAccount, styles.link]}
          onPress={onDeleteScreen}>
          <Text
            style={[
              styles.optionText,
              {color: colors.error, fontFamily: "inherit"},
            ]}>
            {t("menu.deleteAccount")}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.link} onPress={onPrivacyPolicyPress}>
        <Text style={styles.optionText}>{t("auth.privacy.link")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={onTermsAndConditionsPress}>
        <Text style={styles.optionText}>{t("menu.terms")}</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};
