import {Slot} from "expo-router";
import {useFonts} from "expo-font";
import {RecoilRoot} from "recoil";
import * as Sentry from "sentry-expo";
import {Platform} from "react-native";
import {useEffect} from "react";

import {SENTRY_DSN} from "@env";
import {version} from "../../package.json";

import {i18nService} from "../utils/i18n/i18nService";

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
  useFonts({
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppingsLight: require("../../assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsThin: require("../../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    i18nService.init();
  }, []);

  return (
    <RecoilRoot>
      <StatusBar />
      <Slot />
    </RecoilRoot>
  );
}
