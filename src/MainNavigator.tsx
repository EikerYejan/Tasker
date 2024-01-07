import {Platform} from "react-native";
import {Suspense, lazy} from "react";
import {createStackNavigator} from "@react-navigation/stack";

import {HomeScreen} from "./screens/HomeScreen/HomeScreen";
import {AuthScreen} from "./screens/AuthScreen/AuthScreen";
import {EditTaskScreen} from "./screens/EditTaskScreen/EditTaskScreen";

import {NavBar} from "./components/NavBar";
import {HeaderBackButton} from "./components/HeaderBackButton";

import {ScreenName} from "./types";

const MenuScreen = lazy(() =>
  import("./screens/MenuScreen").then(mod => ({default: mod.MenuScreen})),
);

// eslint-disable-next-line
type ParamsList = {
  [ScreenName.EDIT_TASK]: {taskId: string};
  [ScreenName.HOME]: undefined;
  [ScreenName.LOGIN]: undefined;
  [ScreenName.MENU]: undefined;
};

const Stack = createStackNavigator<ParamsList>();

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
        name={ScreenName.EDIT_TASK}
        options={{
          header: () => <HeaderBackButton />,
          presentation: "modal",
        }}>
        {({route}) => <EditTaskScreen taskId={route.params.taskId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
