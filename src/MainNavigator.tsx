import { createStackNavigator } from "@react-navigation/stack";

import { OnboardingScreen } from "./screens/OnboardingScreen";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { NavBar } from "./components/NavBar";

import { useAppState } from "./store/store";

const Stack = createStackNavigator();

export const MainNavigator = () => {
  const {
    state: { loggedIn },
  } = useAppState();

  // TODO: improve this
  const initialRouteName = loggedIn ? "Home" : "OnBoarding";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        header: () => <NavBar />,
      }}
    >
      <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
    </Stack.Navigator>
  );
};
