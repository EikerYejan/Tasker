import {Suspense, lazy, useEffect, useMemo, useState} from "react";
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

const WebMenu = lazy(() =>
  import("./WebMenu").then(mod => ({default: mod.WebMenu})),
);

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isWeb = Platform.OS === "web";

  const switchOverlayTranslateX = useSharedValue(0);

  const {appearance, colors, toggleAppearance} = useAppearance();

  const navigation = useNavigation<any>();

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
          maxWidth: 1460,
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
    if (isWeb) {
      setIsMenuOpen(true);
    } else {
      navigation.navigate("Menu");
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    switchOverlayTranslateX.value = withSpring(appearance === "dark" ? 44 : 0, {
      stiffness: 90,
      mass: 0.5,
    });
  }, [appearance]);

  const barStyle = useMemo(() => {
    return appearance === "dark" ? "light-content" : "dark-content";
  }, [appearance]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {isWeb ? (
        <Suspense fallback={null}>
          <WebMenu isOpen={isMenuOpen} onClose={closeMenu} />
        </Suspense>
      ) : null}
      <StatusBar
        animated
        backgroundColor={colors.background}
        barStyle={barStyle}
      />
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
