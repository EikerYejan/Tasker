import {Platform} from "react-native";
import {Suspense, lazy} from "react";
import {createStackNavigator} from "@react-navigation/stack";

import {HomeScreen} from "./screens/HomeScreen/HomeScreen";
import {AuthScreen} from "./screens/AuthScreen";
import {NavBar} from "./components/NavBar";

const MenuScreen = lazy(() =>
  import("./screens/MenuScreen").then(mod => ({default: mod.MenuScreen})),
);

const Stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => <NavBar />,
      }}>
      <Stack.Screen component={HomeScreen} name="Home" />
      {Platform.OS !== "web" && (
        <Stack.Screen
          name="Menu"
          options={{
            headerShown: false,
            presentation: "modal",
          }}>
          {props => (
            <Suspense>
              <MenuScreen {...props} />
            </Suspense>
          )}
        </Stack.Screen>
      )}
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
