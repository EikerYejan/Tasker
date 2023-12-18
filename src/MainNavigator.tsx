import {createStackNavigator} from "@react-navigation/stack";

import {HomeScreen} from "./screens/HomeScreen/HomeScreen";
import {OnboardingScreen} from "./screens/OnboardingScreen";
import {MenuScreen} from "./screens/MenuScreen";
import {NavBar} from "./components/NavBar";

import {useAppearance} from "./hooks/useAppearance";

const Stack = createStackNavigator();

export const MainNavigator = () => {
  useAppearance();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => <NavBar />,
      }}>
      <Stack.Screen component={OnboardingScreen} name="OnBoarding" />
      <Stack.Screen component={HomeScreen} name="Home" />
      <Stack.Screen
        component={MenuScreen}
        name="Menu"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};
