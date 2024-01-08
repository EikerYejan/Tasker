import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  type TextInput as RNTextInput,
  Pressable,
  Linking,
} from "react-native";
import {useMemo, useRef, useState} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {useTranslation} from "react-i18next";
import Sentry from "sentry-expo";

import {TextInput} from "../../components/TextInput/TextInput";
import {Button} from "../../components/Button/Button";
import {ScreenWrapper} from "../../components/ScreenWrapper";
import {SocialAuthButton} from "../../components/SocialAuthButton/SocialAuthButton";

import {PRIVACY_POLICIY_URL} from "../../constants/urls";
import {SocialLoginProvider} from "../../types";

import {useAppearance} from "../../hooks/useAppearance";
import {AuthService} from "../../utils/auth/auth";
import {FirestoreService} from "../../utils/firestore/firestore";
import {Alert} from "../../utils/alert/alert";
import {isEmailValid} from "../../utils";

import {authScreenStyles as styles} from "./styles";

import type {NavigationProp} from "@react-navigation/native";

interface Props {
  enableAnonymousLogin?: boolean;
  navigation?: NavigationProp<any, any>;
}

type UserType = "existing" | "new" | "undetermined";

export const AuthScreen = ({enableAnonymousLogin, navigation}: Props) => {
  const [userType, setUserType] = useState<UserType>("undetermined");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string>();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const {colors} = useAppearance();

  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);

  const {i18n, t} = useTranslation();

  const onBackPress = () => {
    setUserType("undetermined");
    setPassword(undefined);
    setError(undefined);

    // Need timeout in web for some reason.
    setTimeout(() => {
      emailInputRef?.current?.focus();
      passwordInputRef?.current?.clear();
    }, 100);
  };

  const onCompleteAuth = async () => {
    await FirestoreService.replaceInstance();

    if (navigation?.navigate) {
      navigation.navigate("Home");
    }
  };

  const alertError = (error: {code?: string; message: string}) => {
    const dismissableErrorCodes = ["auth/popup-closed-by-user", "1001", "-5"];

    console.log(error.code, error.message);

    let message = t("auth.error.default");

    if (error.code === "auth/invalid-email") {
      message = t("auth.error.invalidEmail");
    } else if (error.code === "auth/weak-password") {
      message = t("auth.error.weakPassword");
    } else if (error.code === "auth/wrong-password") {
      message = t("auth.error.wrongPassword");
    } else if (error.code === "auth/network-request-failed") {
      message = t("auth.error.networkError");
    } else if (error.code === "auth/too-many-requests") {
      message = t("auth.error.tooManyRequests");
    } else if (error.code === "auth/account-exists-with-different-credential") {
      message = t("auth.error.existingCredential");
    } else if (error.code && dismissableErrorCodes.includes(error.code)) {
      return;
    }

    const sentryPayload = {
      extra: {
        code: error.code,
        message: error.message,
      },
      level: "error",
      tags: {
        user: AuthService.getCurrentUser()?.uid,
      },
    } as const;

    if (Platform.OS === "web") {
      Sentry.Browser.captureMessage(message, sentryPayload);
    } else {
      Sentry.Native.captureMessage(message, sentryPayload);
    }

    setError(message);
  };

  const alertUserForDataReset = (callback?: () => void) => {
    Alert.alert(
      t("auth.alert.dataResetTitle"),
      t("auth.alert.dateResetMessage"),
      [
        {
          text: t("alert.cancel"),
          style: "cancel",
        },
        {
          text: t("auth.button.existingUser"),
          onPress: callback,
        },
      ],
    );
  };

  const onNextPress = async () => {
    try {
      setLoading(true);

      if (email && !password) {
        const authMethods = await AuthService.getLoginMethodsForEmail(email);
        const hasPassword = authMethods?.includes("password");

        if (!hasPassword && authMethods.length) {
          Alert.alert(
            t("auth.alert.socialAccountExists"),
            t("auth.alert.socialAccountExistsMessage").replace(
              "{providers}",
              authMethods.join(", "),
            ),
          );

          return;
        }

        setUserType(hasPassword ? "existing" : "new");

        // Need timeout in web for some reason.
        setTimeout(() => {
          passwordInputRef?.current?.focus();
        }, 100);

        return;
      }

      if (email && password) {
        if (userType === "existing") {
          const isLoggedInAsAnonymous =
            AuthService.getCurrentUser()?.isAnonymous;

          const emailSignIn = async () => {
            try {
              setLoading(true);
              await AuthService.signInWithEmailAndPassword(email, password);
              await onCompleteAuth();
              setLoading(false);
            } catch (error) {
              alertError({code: error.code, message: error.message});
            } finally {
              setLoading(false);
            }
          };

          if (isLoggedInAsAnonymous) {
            alertUserForDataReset(emailSignIn);
          } else {
            await emailSignIn();
          }
        } else {
          await AuthService.signUpWithEmailAndPassword(email, password);
          await onCompleteAuth();
        }
      }
    } catch (error) {
      alertError({code: error.code, message: error.message});
    } finally {
      setLoading(false);
    }
  };

  const onContinueWithoutAccount = async () => {
    try {
      if (loading) return;

      setLoading(true);

      await AuthService.signInAnonymously();

      await onCompleteAuth();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onSocialLoginPress = (provider: SocialLoginProvider) => {
    return async () => {
      try {
        if (loading) return;

        setLoading(true);
        setError(undefined);

        const isLoggedInAsAnonymous = AuthService.getCurrentUser()?.isAnonymous;

        const socialSignIn = async () => {
          await AuthService.signInWithProvider(provider);
          await onCompleteAuth();
        };

        if (isLoggedInAsAnonymous) {
          alertUserForDataReset(socialSignIn);
        } else {
          await socialSignIn();
        }
      } catch (error) {
        alertError({code: error.code, message: error.message});
      } finally {
        setLoading(false);
      }
    };
  };

  const onForgotPasswordPress = () => {
    Alert.prompt(
      t("auth.alert.forgotPassword"),
      t("auth.alert.enterEmail"),
      async email => {
        try {
          const parsedEmail = email?.replace(/\s/g, "");

          if (!parsedEmail) return;

          await AuthService.sendPasswordResetEmail(parsedEmail);

          Alert.alert(
            t("auth.alert.passwordResetConfirmation"),
            t("auth.alert.passwordResetConfirmationMessage"),
          );
        } catch (error) {
          alertError({code: error.code, message: error.message});
        }
      },
      undefined,
      email,
    );
  };

  const onChangeText = (field: "email" | "password") => (text: string) => {
    if (field === "email") {
      setEmail(text);
    } else {
      setPassword(text);
    }

    if (error) {
      setError(undefined);
    }
  };

  const buttonText = useMemo(() => {
    if (userType !== "undetermined") {
      return userType === "existing"
        ? t("auth.button.existingUser")
        : t("auth.button.newUser");
    }

    return t("auth.button.default");
  }, [i18n.language, userType]);

  const submitButtonDisabled = useMemo(() => {
    const validEmail = email && isEmailValid(email);

    return loading || !validEmail || (userType !== "undetermined" && !password);
  }, [email, loading, password, userType]);

  const pageTitle = useMemo(() => {
    if (userType !== "undetermined") {
      return userType === "existing"
        ? t("auth.title.existingUser")
        : t("auth.title.newUser");
    }

    return t("auth.title.default");
  }, [i18n.language, userType]);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inner}>
          {navigation && navigation?.goBack ? (
            <Pressable style={styles.closeButton} onPress={navigation.goBack}>
              <Icon name="close-outline" size={35} color={colors.text} />
            </Pressable>
          ) : null}
          <Text style={[styles.heading, {color: colors.text}]}>
            {pageTitle}
          </Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            disabled={userType !== "undetermined" || loading}
            inputMode="email"
            placeholder={t("auth.inputs.email.placeholder")}
            ref={emailInputRef}
            style={styles.input}
            onChangeText={onChangeText("email")}
            onSubmitEditing={onNextPress}
          />
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            disabled={loading}
            id="passwordInput"
            placeholder={t("auth.inputs.password.placeholder")}
            ref={passwordInputRef}
            style={[
              styles.input,
              userType === "undetermined" && {display: "none"},
            ]}
            onChangeText={onChangeText("password")}
            onSubmitEditing={onNextPress}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Button
            loading={loading}
            disabled={submitButtonDisabled}
            label={buttonText}
            style={styles.button}
            onPress={onNextPress}
          />
          <View style={styles.socialAuthWrapper}>
            {AuthService.isAppleAuthSupported ? (
              <SocialAuthButton
                disabled={loading}
                provider={SocialLoginProvider.APPLE}
                onPress={onSocialLoginPress(SocialLoginProvider.APPLE)}
              />
            ) : null}
            {AuthService.isGoogleAuthSupported ? (
              <SocialAuthButton
                disabled={loading}
                provider={SocialLoginProvider.GOOGLE}
                onPress={onSocialLoginPress(SocialLoginProvider.GOOGLE)}
              />
            ) : null}
            {AuthService.isTwitterAuthSupported ? (
              <SocialAuthButton
                disabled={loading}
                provider={SocialLoginProvider.TWITTER}
                onPress={onSocialLoginPress(SocialLoginProvider.TWITTER)}
              />
            ) : null}
            {AuthService.isGithubAuthSupported ? (
              <SocialAuthButton
                disabled={loading}
                provider={SocialLoginProvider.GITHUB}
                onPress={onSocialLoginPress(SocialLoginProvider.GITHUB)}
              />
            ) : null}
          </View>
          {userType !== "undetermined" && (
            <Pressable disabled={loading} onPress={onBackPress}>
              <Text
                style={[
                  styles.continueWithoutAccountText,
                  {color: colors.text},
                ]}>
                {t("auth.goBackButton")}
              </Text>
            </Pressable>
          )}
          {userType === "undetermined" && enableAnonymousLogin ? (
            <Pressable disabled={loading} onPress={onContinueWithoutAccount}>
              <Text
                style={[
                  styles.continueWithoutAccountText,
                  {color: colors.text},
                ]}>
                {t("auth.continueWithoutAccount")}
              </Text>
            </Pressable>
          ) : null}
          <Pressable disabled={loading} onPress={onForgotPasswordPress}>
            <Text
              style={[
                styles.continueWithoutAccountText,
                {color: colors.text, marginTop: 0},
              ]}>
              {t("auth.forgotPassword")}
            </Text>
          </Pressable>
        </View>

        {userType === "new" && (
          <View style={[styles.continueWithoutAccountText, styles.termsButton]}>
            <Text style={{color: colors.text}}>{t("auth.privacy.title")} </Text>
            <Pressable
              onPress={() => {
                Linking.openURL(PRIVACY_POLICIY_URL);
              }}>
              <Text
                style={[styles.continueWithoutAccountText, styles.termsLink]}>
                {t("auth.privacy.link")}
              </Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
