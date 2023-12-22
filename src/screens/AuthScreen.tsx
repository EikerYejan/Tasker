import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextInput as RNTextInput,
} from "react-native";
import {useMemo, useRef, useState} from "react";

import {TextInput} from "../components/TextInput/TextInput";
import {Button} from "../components/Button/Button";
import {ScreenWrapper} from "../components/ScreenWrapper";
import Icon from "react-native-vector-icons/Ionicons";

import {FONTS} from "../constants/fonts";

import {useAppearance} from "../hooks/useAppearance";
import {useAppState} from "../store/store";
import {AuthService} from "../utils/auth/auth";
import {FirestoreService} from "../utils/firestore/firestore";
import {isEmailValid} from "../utils";

import type {NavigationProp} from "@react-navigation/native";

interface Props {
  navigation?: NavigationProp<any, any>;
  onContinueWithoutAccountPress?: () => void;
}

// TODO: error state, transitions.
export const AuthScreen = ({
  navigation,
  onContinueWithoutAccountPress,
}: Props) => {
  const {setState} = useAppState();

  const [existingUser, setExistingUser] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const {colors} = useAppearance();

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
    },
    closeButton: {
      position: "absolute",
      zIndex: 1,
      right: 0,
      top: 0,
    },
  });

  const onNextPress = async () => {
    try {
      setLoading(true);

      if (email && !password) {
        const isEmailUsed = await AuthService.getIsEmailUsed(email);

        setExistingUser(isEmailUsed);
        passwordInputRef?.current?.focus();

        return;
      }

      if (email && password) {
        if (existingUser) {
          await AuthService.signInWithEmailAndPassword(email, password);
        } else {
          await AuthService.signUpWithEmailAndPassword(email, password);
        }

        await FirestoreService.replaceInstance();

        FirestoreService.listenForChanges(snapshot => {
          if (snapshot) setState(snapshot);
        });

        if (navigation?.navigate) {
          navigation.navigate("Home");
        }
      }
    } catch (error) {
      console.log(error);

      let message = "Please try again";

      if (error.code === "auth/invalid-email") {
        message = "Invalid email";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak";
      }

      Alert.alert("There's been an error", message);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = useMemo(() => {
    if (typeof existingUser === "boolean") {
      return existingUser ? "Sign in" : "Sign up";
    }

    return "Next";
  }, [existingUser]);

  const submitButtonDisabled = useMemo(() => {
    const validEmail = email && isEmailValid(email);

    return (
      loading || !validEmail || (typeof existingUser === "boolean" && !password)
    );
  }, [email, existingUser, loading, password]);

  const pageTitle = useMemo(() => {
    if (typeof existingUser === "boolean") {
      return existingUser ? "Welcome Back!" : "Let's create your account";
    }

    return "Let's get started";
  }, [existingUser]);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inner}>
          {navigation && navigation?.goBack ? (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={navigation.goBack}>
              <Icon name="close-outline" size={35} color={colors.text} />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.heading}>{pageTitle}</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Your email"
            style={styles.input}
            onChangeText={setEmail}
            onSubmitEditing={onNextPress}
          />
          {typeof existingUser === "boolean" && (
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Your password"
              ref={passwordInputRef}
              style={styles.input}
              onChangeText={setPassword}
              onSubmitEditing={onNextPress}
            />
          )}
          <Button
            loading={loading}
            disabled={submitButtonDisabled}
            label={buttonText}
            style={styles.button}
            onPress={onNextPress}
          />
          {typeof existingUser === "boolean" ? (
            <TouchableOpacity
              onPress={() => {
                setExistingUser(undefined);
              }}>
              <Text style={styles.continueWithoutAccountText}>Go Back</Text>
            </TouchableOpacity>
          ) : null}
          {onContinueWithoutAccountPress ? (
            <TouchableOpacity onPress={onContinueWithoutAccountPress}>
              <Text style={styles.continueWithoutAccountText}>
                Continue without an account
              </Text>
            </TouchableOpacity>
          ) : null}
          {__DEV__ ? (
            <TouchableOpacity onPress={AuthService.logOutUser}>
              <Text style={styles.continueWithoutAccountText}>Test LogOut</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};