import {useEffect} from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, {useSharedValue, withSpring} from "react-native-reanimated";
import {useNavigation} from "@react-navigation/native";

import {useAppearance} from "../hooks/useAppearance";

export const NavBar = () => {
  const switchOverlayTranslateX = useSharedValue(0);

  const {appearance, colors, toggleAppearance} = useAppearance();

  const {navigate} = useNavigation<any>();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 15,
      paddingHorizontal: 10,
      ...Platform.select({
        web: {
          paddingBottom: 25,
          paddingRight: 25,
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
    navigate("Menu");
  };

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
        {Platform.OS !== "web" ? (
          <TouchableOpacity onPress={navigateToMenu}>
            <Icon color={colors.text} name="menu-outline" size={30} />
          </TouchableOpacity>
        ) : null}
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
