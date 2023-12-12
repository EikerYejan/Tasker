import { Text, View } from "react-native";
import { ScreenWrapper } from "../components/ScreenWrapper";
import { Button } from "../components/Button/Button";
import { useAppState } from "../store/store";

export const HomeScreen = () => {
  const { resetState, state } = useAppState();
  const { name } = state;

  const isDev = __DEV__;

  return (
    <ScreenWrapper>
      <Text>Ahoy! {name}</Text>
      {isDev ? <Button label="Clear App Storage" onPress={resetState} /> : null}
    </ScreenWrapper>
  );
};
