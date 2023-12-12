import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import type { NavigationProp } from "@react-navigation/native";

import { TextInput } from "../components/TextInput/TextInput";
import { Button } from "../components/Button/Button";
import { ScreenWrapper } from "../components/ScreenWrapper";

import { FONTS } from "../constants/fonts";
import { COLORS } from "../constants/colors";

import { useAppState } from "../store/store";

interface Props {
  navigation: NavigationProp<never, never>;
}

const styles = StyleSheet.create({
  inner: {
    marginBottom: "auto",
    marginTop: "auto",
    maxWidth: 450,
    padding: 20,
    width: "100%",
  },
  heading: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontWeight: "700",
    fontSize: 36,
    marginBottom: 30,
    textAlign: "center",
  },
  input: { width: "80%", marginLeft: "auto", marginRight: "auto" },
  button: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
  },
});

export const OnboardingScreen = ({ navigation }: Props) => {
  const [userName, setUserName] = useState<string>();

  const { setName } = useAppState();

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
      <View style={styles.inner}>
        <Text style={styles.heading}>Let me know your name.</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Your name"
          style={styles.input}
          onChangeText={onNameChange}
        />
        <Button
          disabled={(userName?.length ?? 0) < 5}
          label="Next"
          style={styles.button}
          onPress={onNextPress}
        />
      </View>
    </ScreenWrapper>
  );
};
