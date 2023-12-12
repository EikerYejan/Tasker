import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { TextInput } from "../components/TextInput/TextInput";
import { Button } from "../components/Button/Button";
import { FONTS } from "../constants/fonts";
import { useAppState } from "../store/store";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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

export const OnboardingScreen = () => {
  const [userName, setUserName] = useState<string>();

  const { setName } = useAppState();

  const onNextPress = () => {
    if (userName) {
      setName(userName);
    }
  };

  const onNameChange = (name: string) => {
    setUserName(name);
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};
