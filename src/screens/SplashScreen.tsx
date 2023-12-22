import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";
import * as RNSplashScreen from "expo-splash-screen";

import {OnboardingScreen} from "./OnboardingScreen";
import {MainNavigator} from "../MainNavigator";

import {AuthService} from "../utils/auth/auth";
import {useAppState} from "../store/store";
import {FirestoreService} from "../utils/firestore/firestore";

export const SplasScreen = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  const {
    setState,
    setUser,
    state: {user},
  } = useAppState();

  const initializeDatabase = async () => {
    await FirestoreService.init();

    FirestoreService.listenForChanges(snapshot => {
      if (snapshot) setState(snapshot);
    });
  };

  const onContinueWithoutAccount = async () => {
    const user = await AuthService.signInAnonymously();
    await initializeDatabase();

    setUser(user);
  };

  useEffect(() => {
    AuthService.init().then(async user => {
      if (user) {
        setUser(user);

        await initializeDatabase();
      }

      setAuthInitialized(true);

      await RNSplashScreen.hideAsync();

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

  if (!user?.uid) {
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
