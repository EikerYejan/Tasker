import {useState, useEffect} from "react";
import {Platform, StyleSheet, View} from "react-native";
import {injectSpeedInsights} from "@vercel/speed-insights";
import {Redirect, SplashScreen, Stack} from "expo-router";

import {FirestoreService} from "../../utils/firestore/firestore";
import {AuthService} from "../../utils/auth/auth";

import {useAppState} from "../../store/store";
import {useAppearance} from "../../hooks/useAppearance";

import {NavBar} from "../../components/NavBar";
import {HeaderBackButton} from "../../components/HeaderBackButton";

import {ScreenName} from "../../types";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
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

  const initializeAuth = async () => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setUser(user);

      await initializeDatabase();
    }

    setAuthInitialized(true);

    SplashScreen.hideAsync();

    FirestoreService.listenForChanges(snapshot => {
      if (snapshot) setStateFromFirestore(snapshot);
    });

    AuthService.listenToAuthState(snapshot => {
      if (snapshot) setUser(snapshot);
    });
  };

  useEffect(() => {
    initializeAuth();

    if (Platform.OS === "web") {
      injectSpeedInsights({});
    }
  }, []);

  if (!authInitialized) return null;

  const isWeb = Platform.OS === "web";

  return (
    <>
      {isWeb && <View id="dialog-root" style={webDialogRootStyles.root} />}
      {user?.uid ? (
        <Stack
          screenOptions={{
            header: NavBar,
          }}>
          <Stack.Screen
            name={ScreenName.MENU}
            options={{
              header: isWeb ? () => null : HeaderBackButton,
              presentation: isWeb ? "transparentModal" : "modal",
            }}
          />
          <Stack.Screen
            name={ScreenName.TASK}
            options={{
              header: isWeb ? () => null : HeaderBackButton,
              presentation: isWeb ? "transparentModal" : "modal",
            }}
          />
        </Stack>
      ) : (
        <Redirect href="auth" />
      )}
    </>
  );
}
