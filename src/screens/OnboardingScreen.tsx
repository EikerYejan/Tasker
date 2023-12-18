import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useMemo, useState} from "react";

import {TextInput} from "../components/TextInput/TextInput";
import {Button} from "../components/Button/Button";
import {ScreenWrapper} from "../components/ScreenWrapper";
import Icon from "react-native-vector-icons/Ionicons";

import {FONTS} from "../constants/fonts";

import {useAppearance} from "../hooks/useAppearance";
import {
  getIsEmailUsed,
  signInAnonymously,
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
} from "../utils/firebase";

import type {NavigationProp} from "@react-navigation/native";

interface Props {
  navigation?: NavigationProp<any, any>;
}

export const OnboardingScreen = ({navigation}: Props) => {
  const [existingUser, setExistingUser] = useState<boolean>();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const {colors} = useAppearance();

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
      if (email && !password) {
        const isEmailUsed = await getIsEmailUsed(email);

        setExistingUser(isEmailUsed);

        return;
      }

      if (email && password) {
        if (existingUser) {
          await signInWithEmailAndPassword(email, password);
        } else {
          await signUpWithEmailAndPassword(email, password);
        }

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
    }
  };

  const onContinueWithoutAccountPress = async () => {
    await signInAnonymously();

    if (navigation?.navigate) {
      navigation.navigate("Home");
    }
  };

  const buttonText = useMemo(() => {
    if (typeof existingUser === "boolean") {
      return existingUser ? "Sign in" : "Sign up";
    }

    return "Next";
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
          <Text style={styles.heading}>Let&apos;s get started</Text>
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
              style={styles.input}
              onChangeText={setPassword}
              onSubmitEditing={onNextPress}
            />
          )}
          <Button
            label={buttonText}
            style={styles.button}
            onPress={onNextPress}
          />
          {existingUser ? (
            <TouchableOpacity
              onPress={() => {
                setExistingUser(undefined);
              }}>
              <Text style={styles.continueWithoutAccountText}>Go Back</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={onContinueWithoutAccountPress}>
            <Text style={styles.continueWithoutAccountText}>
              Continue without an account
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
