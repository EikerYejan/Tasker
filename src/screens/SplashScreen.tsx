import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";

import {MainNavigator} from "../MainNavigator";

import {initializeFirebase, listenToAuthState} from "../utils/firebase";
import {useAppState} from "../store/store";
import {OnboardingScreen} from "./OnboardingScreen";

export const SplasScreen = () => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  const {
    setUser,
    state: {user},
  } = useAppState();

  useEffect(() => {
    initializeFirebase().then(() => {
      setFirebaseInitialized(true);

      listenToAuthState(user => {
        console.log("Auth state changed", user);

        setUser(user);
      });
    });
  }, []);

  if (!firebaseInitialized) {
    return null;
  }

  if (!user?.onBoardingComplete) {
    return <OnboardingScreen />;
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
