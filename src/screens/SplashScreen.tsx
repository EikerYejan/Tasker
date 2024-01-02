import {Platform, StyleSheet, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";
import * as RNSplashScreen from "expo-splash-screen";
import {injectSpeedInsights} from "@vercel/speed-insights";

import {AuthScreen} from "./AuthScreen/AuthScreen";
import {MainNavigator} from "../MainNavigator";

import {AuthService} from "../utils/auth/auth";
import {i18nService} from "../utils/i18n/i18nService";
import {useAppState} from "../store/store";
import {FirestoreService} from "../utils/firestore/firestore";
import {useAppearance} from "../hooks/useAppearance";

export const SplasScreen = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  const {
    setStateFromFirestore,
    setUser,
    state: {user},
  } = useAppState();
  const {colors} = useAppearance();

  const webDialogRootStyles = StyleSheet.create({
    root: {
      backgroundColor: colors.primaryInverse,
      color: colors.primary,
    },
  });

  const initializeDatabase = async () => {
    await FirestoreService.init();
  };

  useEffect(() => {
    i18nService.init();

    AuthService.init().then(async user => {
      if (user) {
        setUser(user);

        await initializeDatabase();
      }

      setAuthInitialized(true);

      await RNSplashScreen.hideAsync();

      FirestoreService.listenForChanges(snapshot => {
        if (snapshot) setStateFromFirestore(snapshot);
      });

      AuthService.listenToAuthState(snapshot => {
        if (snapshot) setUser(snapshot);
      });
    });

    if (Platform.OS === "web") {
      injectSpeedInsights({});
    }

    return () => {
      AuthService.stopListeningToAuthState();
      FirestoreService.stopListeningForChanges();
    };
  }, []);

  if (!authInitialized) {
    return null;
  }

  return (
    <>
      {Platform.OS === "web" && (
        <View id="dialog-root" style={webDialogRootStyles.root} />
      )}
      {user?.uid ? (
        <NavigationContainer
          documentTitle={{
            enabled: true,
            formatter: (_, route) => `TasksZen | ${route?.name}`,
          }}>
          <MainNavigator />
        </NavigationContainer>
      ) : (
        <AuthScreen enableAnonymousLogin />
      )}
    </>
  );
};
