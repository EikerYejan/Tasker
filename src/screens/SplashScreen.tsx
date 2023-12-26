import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";
import * as RNSplashScreen from "expo-splash-screen";

import {AuthScreen} from "./AuthScreen";
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

  if (!user?.uid) {
    return <AuthScreen enableAnonymousLogin />;
  }

  return (
    <NavigationContainer
      documentTitle={{
        enabled: true,
        formatter: (_, route) => `TasksZen | ${route?.name}`,
      }}>
      <MainNavigator />
    </NavigationContainer>
  );
};
