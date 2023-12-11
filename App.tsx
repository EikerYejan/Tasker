import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "./src/components/Button/Button";
import { TextInput } from "./src/components/TextInput/TextInput";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <OnboardingScreen />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginRight: "auto",
  },
  title: {
    marginBottom: 15,
  },
  description: {
    height: 100,
    marginBottom: 30,
  },
});
