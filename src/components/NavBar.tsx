import { useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

import { useAppearance } from "../hooks/useAppearance";

export const NavBar = () => {
  const switchOverlayTranslateX = useSharedValue(0);

  const { appearance, colors, toggleAppearance } = useAppearance();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingBottom: 15,
      paddingRight: 10,
      ...Platform.select({
        web: {
          paddingBottom: 25,
          paddingRight: 48,
          paddingTop: 25,
        },
        native: {},
      }),
    },
    safeAreaView: {
      backgroundColor: colors.background,
    },
    themeSwitch: {
      alignItems: "center",
      borderColor: colors.border,
      borderWidth: 1,
      flexDirection: "row",
      height: 40,
      width: 90,
      overflow: "hidden",
    },
    themeSwitchHandle: {
      backgroundColor: colors.text,
      height: "100%",
      position: "absolute",
      width: 45,
    },
    icon: {
      fontSize: 25,
      textAlign: "center",
      width: "50%",
    },
  });

  useEffect(() => {
    switchOverlayTranslateX.value = withSpring(appearance === "dark" ? 44 : 0, {
      stiffness: 90,
      mass: 0.5,
    });
  }, [appearance]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar
        barStyle={appearance === "dark" ? "light-content" : "dark-content"}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.themeSwitch} onPress={toggleAppearance}>
          <Animated.View
            style={[
              styles.themeSwitchHandle,
              { left: switchOverlayTranslateX },
            ]}
          />
          <Icon color={colors.text} name="sunny-outline" style={styles.icon} />
          <Icon color={colors.text} name="moon-outline" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
