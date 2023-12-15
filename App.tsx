import "react-native-gesture-handler";
import "@expo/match-media";

import { StyleSheet, View, useColorScheme } from "react-native";
import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { RecoilRoot } from "recoil";
import { NavigationContainer } from "@react-navigation/native";

import { MainNavigator } from "./src/MainNavigator";

import { DarkTheme, LightTheme } from "./src/constants/themes";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
    PoppingsLight: require("./assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    PoppinsThin: require("./assets/fonts/Poppins-Thin.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <RecoilRoot>
        <NavigationContainer
          theme={colorScheme === "dark" ? DarkTheme : LightTheme}
        >
          {fontsLoaded ? <MainNavigator /> : null}
        </NavigationContainer>
      </RecoilRoot>
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
