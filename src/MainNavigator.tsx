import { createStackNavigator } from "@react-navigation/stack";

import { OnboardingScreen } from "./screens/OnboardingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { useAppState } from "./store/store";

const Stack = createStackNavigator();

export const MainNavigator = () => {
  const {
    state: { loggedIn },
  } = useAppState();

  const initialRouteName = loggedIn ? "Home" : "OnBoarding";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
