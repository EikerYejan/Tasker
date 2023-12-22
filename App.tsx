import "react-native-gesture-handler";
import "@expo/match-media";

import {StyleSheet, View} from "react-native";
import {useFonts} from "expo-font";
import {RecoilRoot} from "recoil";
import * as RNSplashScreen from "expo-splash-screen";

import {SplasScreen} from "./src/screens/SplashScreen";

RNSplashScreen.preventAutoHideAsync();

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
