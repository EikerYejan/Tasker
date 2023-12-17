import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {useState} from "react";
import {type NavigationProp} from "@react-navigation/native";

import {TextInput} from "../components/TextInput/TextInput";
import {Button} from "../components/Button/Button";
import {ScreenWrapper} from "../components/ScreenWrapper";

import {FONTS} from "../constants/fonts";

import {useAppState} from "../store/store";
import {useAppearance} from "../hooks/useAppearance";

interface Props {
  navigation: NavigationProp<never, never>;
}

export const OnboardingScreen = ({navigation}: Props) => {
  const [userName, setUserName] = useState<string>();

  const {setName} = useAppState();
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
    input: {width: "80%", marginLeft: "auto", marginRight: "auto"},
    button: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 15,
    },
  });

  const onNextPress = () => {
    if (userName) {
      setName(userName);
      navigation.navigate("Home" as never);
    }
  };

  const onNameChange = (name: string) => {
    setUserName(name);
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inner}>
          <Text style={styles.heading}>Let me know your name.</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Your name"
            style={styles.input}
            onChangeText={onNameChange}
            onSubmitEditing={onNextPress}
          />
          <Button
            disabled={(userName?.length ?? 0) < 5}
            label="Next"
            style={styles.button}
            onPress={onNextPress}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
