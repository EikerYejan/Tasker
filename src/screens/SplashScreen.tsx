import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";

import {MainNavigator} from "../MainNavigator";

import {initializeAuth, listenToAuthState} from "../utils/auth/auth";
import {useAppState} from "../store/store";
import {OnboardingScreen} from "./OnboardingScreen";

export const SplasScreen = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  const {
    setUser,
    state: {user},
  } = useAppState();

  useEffect(() => {
    initializeAuth().then(() => {
      setAuthInitialized(true);

      listenToAuthState(user => {
        console.log("Auth state changed", user);

        setUser(user);
      });
    });
  }, []);

  if (!authInitialized) {
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
