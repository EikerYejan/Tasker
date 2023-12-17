import {createStackNavigator} from "@react-navigation/stack";
import {Suspense, lazy} from "react";
import {ActivityIndicator} from "react-native";

import {NavBar} from "./components/NavBar";

import {useAppearance} from "./hooks/useAppearance";
import {useAppState} from "./store/store";

const Stack = createStackNavigator();

const OnboardingScreen = lazy(() =>
  import("./screens/OnboardingScreen").then(mod => ({
    default: mod.OnboardingScreen,
  })),
);

const HomeScreen = lazy(() =>
  import("./screens/HomeScreen/HomeScreen").then(mod => ({
    default: mod.HomeScreen,
  })),
);

const MenuScreen = lazy(() =>
  import("./screens/MenuScreen").then(mod => ({
    default: mod.MenuScreen,
  })),
);

export const MainNavigator = () => {
  const {
    state: {loggedIn},
  } = useAppState();

  useAppearance();

  // TODO: improve this
  const initialRouteName = loggedIn ? "Home" : "OnBoarding";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        header: () => <NavBar />,
      }}>
      <Stack.Screen name="OnBoarding">
        {props => (
          <Suspense fallback={<ActivityIndicator />}>
            <OnboardingScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="Home">
        {() => (
          <Suspense fallback={<ActivityIndicator />}>
            <HomeScreen />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Menu"
        options={{
          headerShown: false,
          presentation: "modal",
        }}>
        {() => (
          <Suspense fallback={<ActivityIndicator />}>
            <MenuScreen />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
