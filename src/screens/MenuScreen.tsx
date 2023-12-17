import {View} from "react-native";

import {ScreenWrapper} from "../components/ScreenWrapper";
import {Button} from "../components/Button/Button";

export const MenuScreen = () => {
  return (
    <ScreenWrapper>
      <View>
        <Button label="Clear App Storage" />
      </View>
    </ScreenWrapper>
  );
};
