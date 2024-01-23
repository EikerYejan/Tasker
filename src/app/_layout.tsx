import {useEffect, useState} from "react";
import {Slot} from "expo-router";
import {useFonts} from "expo-font";
import {RecoilRoot} from "recoil";
import * as Sentry from "sentry-expo";
import {Platform} from "react-native";

import {SENTRY_DSN} from "@env";
import {version} from "../../package.json";

import {i18nService} from "../utils/i18n/i18nService";
import {AuthService} from "../utils/auth/auth";

import {StatusBar} from "../components/StatusBar";

Sentry.init({
  debug: true,
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: false,
  initialScope: {
    extra: {
      version,
      platform: Platform.OS,
    },
  },
  normalizeDepth: 0,
  release: version,
});

export default function MainLayout() {
  const [canRender, setCanRender] = useState(false);

  useFonts({
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppingsLight: require("../../assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsThin: require("../../assets/fonts/Poppins-Thin.ttf"),
  });

  const initialize = async () => {
    try {
      await AuthService.init();
      await i18nService.init();

      setCanRender(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  // TODO: add loader screen for web
  if (!canRender) return null;

  return (
    <RecoilRoot>
      <StatusBar />
      <Slot />
    </RecoilRoot>
  );
}
