import {NavigationContainer} from "@react-navigation/native";
import {useEffect} from "react";

import {MainNavigator} from "./MainNavigator";

import {initializeFirebase} from "./utils/firebase";
import {useAppState} from "./store/store";

export const AppContainer = () => {
  const {setUser} = useAppState();

  useEffect(() => {
    initializeFirebase().then(user => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

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
