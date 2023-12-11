import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TextInput } from "../components/TextInput/TextInput";
import { Button } from "../components/Button/Button";
import { FONTS } from "../constants/fonts";

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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Let me know your name.</Text>
        <TextInput placeholder="Your name" style={styles.input} />
        <Button label="Next" style={styles.button} />
      </View>
    </SafeAreaView>
  );
};
