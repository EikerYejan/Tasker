import "react-native-gesture-handler";
import "@expo/match-media";
import "@expo/metro-runtime";

import {Platform, StyleSheet, View} from "react-native";
import {useFonts} from "expo-font";
import {RecoilRoot} from "recoil";
import * as RNSplashScreen from "expo-splash-screen";
import * as Sentry from "sentry-expo";

import {version} from "./package.json";
import {SENTRY_DSN} from "@env";

import {SplasScreen} from "./src/screens/SplashScreen";

RNSplashScreen.preventAutoHideAsync();

Sentry.init({
  debug: true,
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: false,
  initialScope: {
    extra: {
      version,
      platform: Platform.OS,
    },
  },
  normalizeDepth: 0,
  release: version,
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
    PoppingsLight: require("./assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    PoppinsThin: require("./assets/fonts/Poppins-Thin.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <RecoilRoot>{fontsLoaded ? <SplasScreen /> : null}</RecoilRoot>
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
