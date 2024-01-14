import {Platform} from "react-native";
import {Suspense, lazy} from "react";
import {createStackNavigator} from "@react-navigation/stack";

import {HomeScreen} from "./screens/HomeScreen/HomeScreen";
import {AuthScreen} from "./screens/AuthScreen/AuthScreen";
import {TaskScreen} from "./screens/TaskScreen/TaskScreen";

import {NavBar} from "./components/NavBar";
import {HeaderBackButton} from "./components/HeaderBackButton";

import {ScreenName, type Screens} from "./types";

const MenuScreen = lazy(() =>
  import("./screens/MenuScreen").then(mod => ({default: mod.MenuScreen})),
);

const Stack = createStackNavigator<Screens>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenName.HOME}
      screenOptions={{
        header: () => <NavBar />,
      }}>
      <Stack.Screen component={HomeScreen} name={ScreenName.HOME} />
      {Platform.OS !== "web" && (
        <Stack.Screen
          name={ScreenName.MENU}
          options={{
            headerShown: false,
            presentation: "modal",
          }}>
          {() => (
            <Suspense>
              <MenuScreen />
            </Suspense>
          )}
        </Stack.Screen>
      )}
      <Stack.Screen
        component={AuthScreen}
        name={ScreenName.LOGIN}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name={ScreenName.TASK}
        options={{
          header: () => <HeaderBackButton />,
          presentation: "modal",
        }}>
        {({route}) => <TaskScreen taskId={route.params?.taskId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
