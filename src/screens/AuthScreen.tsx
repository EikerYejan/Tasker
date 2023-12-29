import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  type TextInput as RNTextInput,
  Pressable,
  Linking,
} from "react-native";
import {useMemo, useRef, useState} from "react";
import Icon from "react-native-vector-icons/Ionicons";

import {TextInput} from "../components/TextInput/TextInput";
import {Button} from "../components/Button/Button";
import {ScreenWrapper} from "../components/ScreenWrapper";
import {SocialAuthButton} from "../components/SocialAuthButton/SocialAuthButton";

import {FONTS} from "../constants/fonts";
import {PRIVACY_POLICIY_URL} from "../constants/urls";
import {SocialLoginProvider} from "../types";

import {useAppearance} from "../hooks/useAppearance";
import {AuthService} from "../utils/auth/auth";
import {FirestoreService} from "../utils/firestore/firestore";
import {Alert} from "../utils/alert/alert";
import {isEmailValid} from "../utils";

import type {NavigationProp} from "@react-navigation/native";

interface Props {
  enableAnonymousLogin?: boolean;
  navigation?: NavigationProp<any, any>;
}

type UserType = "existing" | "new" | "undetermined";

// TODO: error state.
export const AuthScreen = ({enableAnonymousLogin, navigation}: Props) => {
  const [userType, setUserType] = useState<UserType>("undetermined");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const {colors} = useAppearance();

  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);

  const styles = StyleSheet.create({
    inner: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "auto",
      maxWidth: 450,
      padding: 20,
      width: "100%",
      height: "100%",
    },
    heading: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 36,
      fontWeight: "700",
      marginBottom: 30,
      textAlign: "center",
    },
    input: {
      marginBottom: 15,
      marginLeft: "auto",
      marginRight: "auto",
      width: "80%",
    },
    button: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 15,
    },
    continueWithoutAccountText: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
      fontSize: 14,
      fontWeight: "400",
      marginBottom: 20,
      marginTop: 10,
      textAlign: "center",
    },
    termsButton: {
      fontSize: 12,
      marginTop: "auto",
    },
    termsLink: {
      color: colors.link,
      fontFamily: FONTS.POPPINS_BOLD,
      fontWeight: "bold",
    },
    closeButton: {
      position: "absolute",
      zIndex: 1,
      right: 0,
      top: 0,
    },
    socialAuthWrapper: {
      marginBottom: 15,
      marginTop: 10,
      flexDirection: "row",
      gap: 15,
    },
  });

  const onBackPress = () => {
    setUserType("undetermined");

    // Need timeout in web for some reason.
    setTimeout(() => {
      emailInputRef?.current?.focus();
    }, 100);
  };

  const onCompleteAuth = async () => {
    await FirestoreService.replaceInstance();

    if (navigation?.navigate) {
      navigation.navigate("Home");
    }
  };

  const alertError = (error: {code?: string; message: string}) => {
    console.log(error.code, error.message);

    let message = "Please try again";

    if (error.code === "auth/invalid-email") {
      message = "Invalid email";
    } else if (error.code === "auth/weak-password") {
      message = "Password is too weak";
    } else if (error.code === "auth/wrong-password") {
      message = "Check your email and password";
    } else if (error.code === "auth/network-request-failed") {
      message = "Network request failed";
    } else if (error.code === "auth/too-many-requests") {
      message = "Too many requests, please try again later";
    } else if (error.code === "auth/account-exists-with-different-credential") {
      message = "Account already exists with a different social provider";
    } else if (error.code === "auth/popup-closed-by-user") {
      return;
    }

    Alert.alert("There's been an error", message);
  };

  const alertUserForDataReset = (callback?: () => void) => {
    Alert.alert("Be careful", "If you sign in, you will lose all your data.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign in",
        onPress: callback,
      },
    ]);
  };

  const onNextPress = async () => {
    try {
      setLoading(true);

      if (email && !password) {
        const isEmailUsed = await AuthService.getIsEmailUsed(email);

        setUserType(isEmailUsed ? "existing" : "new");

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
    Alert.prompt("Forgot your password?", "Enter your email", async email => {
      try {
        await AuthService.sendPasswordResetEmail(email.replace(/\s/g, ""));

        Alert.alert(
          "Password reset email sent",
          "Please check your email for further instructions.",
        );
      } catch (error) {
        alertError({code: error.code, message: error.message});
      }
    });
  };

  const buttonText = useMemo(() => {
    if (userType !== "undetermined") {
      return userType === "existing" ? "Sign in" : "Sign up";
    }

    return "Next";
  }, [userType]);

  const submitButtonDisabled = useMemo(() => {
    const validEmail = email && isEmailValid(email);

    return loading || !validEmail || (userType !== "undetermined" && !password);
  }, [email, loading, password, userType]);

  const pageTitle = useMemo(() => {
    if (userType !== "undetermined") {
      return userType === "existing"
        ? "Welcome Back!"
        : "Let's create your account";
    }

    return "Let's get started";
  }, [userType]);

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
          <Text style={styles.heading}>{pageTitle}</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            disabled={userType !== "undetermined" || loading}
            inputMode="email"
            placeholder="Your email"
            ref={emailInputRef}
            style={styles.input}
            onChangeText={setEmail}
            onSubmitEditing={onNextPress}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            disabled={loading}
            id="passwordInput"
            placeholder="Your password"
            ref={passwordInputRef}
            secureTextEntry
            style={[
              styles.input,
              userType === "undetermined" && {display: "none"},
            ]}
            onChangeText={setPassword}
            onSubmitEditing={onNextPress}
          />
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
          </View>
          {userType !== "undetermined" && (
            <Pressable disabled={loading} onPress={onBackPress}>
              <Text style={styles.continueWithoutAccountText}>Go Back</Text>
            </Pressable>
          )}
          {userType === "undetermined" && enableAnonymousLogin ? (
            <Pressable disabled={loading} onPress={onContinueWithoutAccount}>
              <Text style={styles.continueWithoutAccountText}>
                Continue without an account
              </Text>
            </Pressable>
          ) : null}
          <Pressable disabled={loading} onPress={onForgotPasswordPress}>
            <Text style={[styles.continueWithoutAccountText, {marginTop: 0}]}>
              Forgot your password?
            </Text>
          </Pressable>
        </View>

        {userType === "new" && (
          <Text style={styles.continueWithoutAccountText}>
            By pressing Sign Up you agree to our{" "}
            <Pressable
              onPress={() => {
                Linking.openURL(PRIVACY_POLICIY_URL);
              }}>
              <Text
                style={[styles.continueWithoutAccountText, styles.termsLink]}>
                Terms & Conditions
              </Text>
            </Pressable>
          </Text>
        )}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
