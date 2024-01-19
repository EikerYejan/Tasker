import {useEffect} from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, {useSharedValue, withSpring} from "react-native-reanimated";
import {router} from "expo-router";

import {useAppearance} from "../hooks/useAppearance";

export const NavBar = () => {
  const switchOverlayTranslateX = useSharedValue(0);

  const {appearance, colors, toggleAppearance} = useAppearance();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 15,
      paddingHorizontal: 20,
      ...Platform.select({
        web: {
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 1420,
          paddingBottom: 25,
          paddingTop: 25,
          width: "100%",
        },
        android: {
          paddingTop: 25,
        },
      }),
    },
    safeAreaView: {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    themeSwitch: {
      alignItems: "center",
      borderColor: colors.border,
      borderWidth: 1,
      flexDirection: "row",
      height: 40,
      marginLeft: "auto",
      overflow: "hidden",
      width: 90,
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

  const navigateToMenu = () => {
    router.push("menu");
  };

  useEffect(() => {
    switchOverlayTranslateX.value = withSpring(appearance === "dark" ? 0 : 44, {
      mass: 0.5,
    });
  }, [appearance]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigateToMenu}>
          <Icon color={colors.text} name="menu-outline" size={30} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeSwitch} onPress={toggleAppearance}>
          <Animated.View
            style={[styles.themeSwitchHandle, {left: switchOverlayTranslateX}]}
          />
          <Icon color={colors.text} name="sunny-outline" style={styles.icon} />
          <Icon color={colors.text} name="moon-outline" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
