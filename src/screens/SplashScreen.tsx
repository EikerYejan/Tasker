import {Platform, StyleSheet, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";
import * as RNSplashScreen from "expo-splash-screen";

import {AuthScreen} from "./AuthScreen";
import {MainNavigator} from "../MainNavigator";

import {AuthService} from "../utils/auth/auth";
import {useAppState} from "../store/store";
import {FirestoreService} from "../utils/firestore/firestore";
import {useAppearance} from "../hooks/useAppearance";

export const SplasScreen = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  const {
    setState,
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
    AuthService.init().then(async user => {
      if (user) {
        setUser(user);

        await initializeDatabase();
      }

      setAuthInitialized(true);

      await RNSplashScreen.hideAsync();

      FirestoreService.listenForChanges(snapshot => {
        if (snapshot) setState(snapshot);
      });

      AuthService.listenToAuthState(snapshot => {
        if (snapshot) setUser(snapshot);
      });
    });

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
