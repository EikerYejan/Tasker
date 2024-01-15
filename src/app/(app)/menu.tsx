import {useEffect, useMemo} from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

import {ScreenWrapper} from "../../components/ScreenWrapper";
import {Button} from "../../components/Button/Button";

import {useAppearance} from "../../hooks/useAppearance";
import {useAppState} from "../../store/store";
import {FirestoreService} from "../../utils/firestore/firestore";
import {AuthService} from "../../utils/auth/auth";
import {i18nService} from "../../utils/i18n/i18nService";
import {Alert} from "../../utils/alert/alert";

import {FONTS} from "../../constants/fonts";
import {PRIVACY_POLICIY_URL, TERMS_OF_SERVICE_URL} from "../../constants/urls";

import {ScreenName} from "../../types";

export default function MenuScreen() {
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
    title: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    link: {
      alignSelf: "flex-start",
    },
    screenWrapper: {
      ...(Platform.OS === "web"
        ? {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }
        : {}),
    },
    contentContainer: {
      ...(Platform.OS === "web"
        ? {
            backgroundColor: colors.background,
            borderRadius: 10,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            marginBottom: "auto",
            marginTop: "auto",
            maxHeight: 500,
            maxWidth: 500,
          }
        : {}),
    },
    closeButton: {
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 1,
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

  const onLogout = async () => {
    await resetState();
    router.replace(ScreenName.AUTH);
  };

  const onLogin = async () => {
    router.push({
      pathname: ScreenName.AUTH,
      params: {
        referer: ScreenName.MENU,
      },
    });
  };

  const onDeleteScreen = () => {
    const deleteAccount = async () => {
      await FirestoreService.deleteDocument();
      await AuthService.deleteUser();

      await onLogout();
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

  const onClose = () => {
    router.push(ScreenName.HOME);
  };

  const onPrivacyPolicyPress = () => {
    Linking.openURL(PRIVACY_POLICIY_URL);
  };

  const onTermsAndConditionsPress = () => {
    Linking.openURL(TERMS_OF_SERVICE_URL);
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);
  const dev = process.env.NODE_ENV === "development";

  return (
    <ScreenWrapper
      disableLocaleChanger
      contentContainerStyle={styles.contentContainer}
      style={styles.screenWrapper}>
      <View>
        {Platform.OS === "web" && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close-outline" size={35} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{t("menu.title")}</Text>
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
          <Button label={t("menu.logout")} onPress={onLogout} />
        </View>
      ) : (
        <View style={styles.option}>
          <Button label={t("menu.login")} onPress={onLogin} />
        </View>
      )}
      {dev ? (
        <Text
          onPress={resetState}
          style={[styles.optionText, {marginBottom: 10}]}>
          Clear App Data
        </Text>
      ) : null}
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
}
