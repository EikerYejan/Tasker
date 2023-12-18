import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useState} from "react";

import {TextInput} from "../components/TextInput/TextInput";
import {Button} from "../components/Button/Button";
import {ScreenWrapper} from "../components/ScreenWrapper";

import {FONTS} from "../constants/fonts";

import {useAppearance} from "../hooks/useAppearance";

import {signInAnonymously, signUpWithEmailAndPassword} from "../utils/firebase";

export const OnboardingScreen = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    inner: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "auto",
      maxWidth: 450,
      padding: 20,
      width: "100%",
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
      marginTop: 10,
    },
  });

  const onNextPress = async () => {
    try {
      if (email && password) {
        await signUpWithEmailAndPassword(email, password);
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
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inner}>
          <Text style={styles.heading}>Let&apos;s get started</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Your email"
            style={styles.input}
            onChangeText={setEmail}
            onSubmitEditing={onNextPress}
          />
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Your password"
            style={styles.input}
            onChangeText={setPassword}
            onSubmitEditing={onNextPress}
          />
          <Button
            disabled={(email?.length ?? 0) < 10 || (password?.length ?? 0) < 5}
            label="Next"
            style={styles.button}
            onPress={onNextPress}
          />
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
