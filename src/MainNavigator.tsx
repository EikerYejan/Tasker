import {createStackNavigator} from "@react-navigation/stack";

import {HomeScreen} from "./screens/HomeScreen/HomeScreen";
import {MenuScreen} from "./screens/MenuScreen";
import {AuthScreen} from "./screens/AuthScreen";
import {NavBar} from "./components/NavBar";

const Stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => <NavBar />,
      }}>
      <Stack.Screen component={HomeScreen} name="Home" />
      <Stack.Screen
        component={MenuScreen}
        name="Menu"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        component={AuthScreen}
        name="Login"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};
