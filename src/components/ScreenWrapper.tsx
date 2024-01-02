import {useEffect} from "react";
import {SafeAreaView, ScrollView, StyleSheet} from "react-native";
import Animated, {useSharedValue, withSpring} from "react-native-reanimated";

import {useAppearance} from "../hooks/useAppearance";

import type {ReactNode} from "react";
import {LocaleChanger} from "./LocaleChanger";

interface Props {
  children: ReactNode;
  disableLocaleChanger?: boolean;
}

export const ScreenWrapper = ({children, disableLocaleChanger}: Props) => {
  const pageOpacity = useSharedValue(0);

  const {colors} = useAppearance();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    inner: {
      flex: 1,
      padding: 20,
      paddingBottom: 0,
    },
    scrollViewContentContainer: {
      flex: 1,
    },
  });

  useEffect(() => {
    pageOpacity.value = withSpring(1, {
      stiffness: 90,
      mass: 0.5,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}>
        <Animated.View style={[styles.inner, {opacity: pageOpacity}]}>
          {children}
        </Animated.View>
        {!disableLocaleChanger && <LocaleChanger />}
      </ScrollView>
    </SafeAreaView>
  );
};
