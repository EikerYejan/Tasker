import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";
import * as RNSplashScreen from "expo-splash-screen";

import {OnboardingScreen} from "./OnboardingScreen";
import {MainNavigator} from "../MainNavigator";

import {initializeAuth, listenToAuthState} from "../utils/auth/auth";
import {useAppState} from "../store/store";
import {getOrCreateDocumentInstance} from "../utils/firestore/firestore";

import type {IAppStore} from "../types";

export const SplasScreen = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  const {
    setState,
    setUser,
    state: {user},
    updateUser,
  } = useAppState();

  const initializeDatabase = async () => {
    const databaseItem = await getOrCreateDocumentInstance();

    if (databaseItem) {
      const unsubscribe = databaseItem.onSnapshot(snapshot => {
        setState(snapshot.data() as IAppStore);
      });

      return unsubscribe;
    }
  };

  const onContinueWithoutAccount = () => {
    updateUser({
      onBoardingComplete: true,
    });
  };

  useEffect(() => {
    initializeAuth().then(async user => {
      if (user) {
        setUser(user);

        await initializeDatabase();
      }

      setAuthInitialized(true);

      await RNSplashScreen.hideAsync();

      listenToAuthState(snapshot => {
        setUser(snapshot);
      });
    });
  }, []);

  if (!authInitialized) {
    return null;
  }

  if (!user?.onBoardingComplete) {
    return (
      <OnboardingScreen
        onContinueWithoutAccountPress={onContinueWithoutAccount}
      />
    );
  }

  return (
    <NavigationContainer
      documentTitle={{
        enabled: true,
        formatter: (opts, route) => `TasksZen | ${route?.name}`,
      }}>
      <MainNavigator />
    </NavigationContainer>
  );
};
