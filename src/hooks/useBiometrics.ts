import {useEffect} from "react";
import {Alert, Platform} from "react-native";
import {useTranslation} from "react-i18next";

import {useAppState} from "../store/store";

import type {IBiometricsSettings} from "../types";

const getBiometricsModule = async () => {
  if (Platform.OS === "web") return null;

  const RNBiomentrics = new (await import("react-native-biometrics")).default(); // eslint-disable-line

  return RNBiomentrics;
};

const simplePrompt = async () => {
  const module = await getBiometricsModule();
  const result = await module?.simplePrompt({
    promptMessage: "Login with biometrics",
  });

  return result?.success ?? false;
};

export const useBiometrics = () => {
  const {
    setState,
    state: {biometrics: savedSettings},
  } = useAppState();

  const {t} = useTranslation();

  const saveBiometricsSettings = (settings: Partial<IBiometricsSettings>) => {
    const newSettings = {
      ...(savedSettings ?? {}),
      ...settings,
    };

    setState(prevState => ({
      ...prevState,
      biometrics: newSettings as IBiometricsSettings,
    }));
  };

  const onLockPress = async () => {
    const {enrolled, locked, supported} = savedSettings ?? {};

    if (!supported) return;

    if (!enrolled) {
      Alert.alert(
        t("biometrics.alert.enroll.title"),
        t("biometrics.alert.enroll.message"),
        [
          {
            text: t("alert.cancel"),
            style: "cancel",
          },
          {
            text: t("alert.enroll"),
            async onPress() {
              const success = await simplePrompt();

              if (!success) return;

              saveBiometricsSettings({
                enrolled: true,
                locked: false,
                timestamp: Date.now(),
              });
            },
          },
        ],
      );

      return;
    }

    if (locked) {
      const success = await simplePrompt();

      if (!success) return;

      saveBiometricsSettings({
        locked: false,
        timestamp: Date.now(),
      });

      return;
    }

    saveBiometricsSettings({
      locked: true,
      timestamp: Date.now(),
    });
  };

  const resetSettings = () => {
    saveBiometricsSettings({
      enrolled: false,
      locked: false,
      sensorType: undefined,
      supported: false,
      timestamp: Date.now(),
    });
  };

  const checkBiometrics = async () => {
    if (Platform.OS === "web") return;

    const module = await getBiometricsModule();
    const result = await module?.isSensorAvailable?.();

    saveBiometricsSettings({
      sensorType: result?.biometryType,
      supported: result?.available ?? false,
    });
  };

  useEffect(() => {
    checkBiometrics();
  }, []);

  return {
    biometricsEnrolled: savedSettings?.enrolled ?? false,
    biometricsSupported: savedSettings?.supported ?? false,
    locked: savedSettings?.locked ?? false,
    onLockPress,
    resetSettings,
    sensorType: savedSettings?.sensorType,
  };
};
