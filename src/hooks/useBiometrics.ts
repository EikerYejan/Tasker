import {useEffect, useMemo, useRef, useState} from "react";
import {Alert, AppState, type AppStateStatus, Platform} from "react-native";

import {storage} from "../store/store";

import type {BiometryType} from "react-native-biometrics";

const KEY = "biometrics";

interface IBiometricsSettings {
  enrolled: boolean;
  locked: boolean;
  sensorType?: BiometryType;
  supported: boolean;
  timestamp: number;
}

// 5 minutes
const TIMESTAMP_EXPIRATION = 1000 * 60 * 5;

const saveBiometricsSettings = (settings: IBiometricsSettings) => {
  storage.set(KEY, JSON.stringify(settings));
};

const getBiometricsSettings = (): IBiometricsSettings => {
  const data = storage.getString(KEY);

  return data ? JSON.parse(data) : {enrolled: false, locked: false};
};

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
  const savedSettings = useMemo(getBiometricsSettings, []);

  const [biometricsSupported, setBiometricsSupported] = useState(
    savedSettings.supported,
  );
  const [biometricsEnrolled, setBiometricsEnrolled] = useState(
    savedSettings.enrolled,
  );

  const [sensorType, setSensorType] = useState<BiometryType | undefined>(
    savedSettings?.sensorType,
  );

  const [locked, setLocked] = useState(savedSettings.locked);

  const appState = useRef(AppState.currentState);

  const onLockPress = async () => {
    const {enrolled, locked, supported} = getBiometricsSettings();

    if (!supported) return;

    if (!enrolled) {
      Alert.alert(
        "Biometrics not enrolled",
        "Do you want to lock your tasks with biometrics?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Enroll",
            async onPress() {
              const success = await simplePrompt();

              if (!success) return;

              saveBiometricsSettings({
                enrolled: true,
                locked: false,
                sensorType,
                supported: true,
                timestamp: Date.now(),
              });
              setBiometricsEnrolled(true);
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
        enrolled,
        locked: false,
        sensorType,
        supported,
        timestamp: Date.now(),
      });
      setLocked(false);

      return;
    }

    saveBiometricsSettings({
      enrolled,
      locked: !locked,
      sensorType,
      supported,
      timestamp: Date.now(),
    });
    setLocked(!locked);
  };

  const resetSettings = () => {
    saveBiometricsSettings({
      enrolled: false,
      locked: false,
      sensorType: undefined,
      supported: false,
      timestamp: Date.now(),
    });

    setBiometricsEnrolled(false);
    setBiometricsSupported(false);
    setLocked(false);
  };

  const checkTimestamp = () => {
    const {timestamp, locked: lockedByUser, enrolled} = getBiometricsSettings();

    if (!enrolled || lockedByUser) return;

    // Checks if 5 minutes or more have passed since the app was put in the background
    const isTimestampValid = Date.now() - timestamp < TIMESTAMP_EXPIRATION;

    setLocked(!isTimestampValid);
    saveBiometricsSettings({
      ...getBiometricsSettings(),
      timestamp: Date.now(),
      locked: !isTimestampValid,
    });
  };

  const onAppForeground = (nextAppState: AppStateStatus) => {
    const {enrolled, ...restSettings} = getBiometricsSettings();

    if (!enrolled) return;

    if (appState.current === "active" && nextAppState === "inactive") {
      setLocked(true);
      saveBiometricsSettings({
        ...restSettings,
        enrolled,
        timestamp: Date.now(),
      });
    } else checkTimestamp();

    appState.current = nextAppState;
  };

  const checkBiometrics = async () => {
    if (Platform.OS === "web") return;
    if (savedSettings.supported) return;

    const module = await getBiometricsModule();
    const result = await module?.isSensorAvailable();

    if (result?.available) {
      setBiometricsSupported(true);
      setSensorType(result.biometryType);
      saveBiometricsSettings({
        ...savedSettings,
        sensorType: result?.biometryType,
        supported: true,
      });
    }
  };

  useEffect(() => {
    checkBiometrics();
    checkTimestamp();

    AppState.addEventListener("change", onAppForeground);
  }, [savedSettings.enrolled]);

  return {
    biometricsEnrolled,
    biometricsSupported,
    locked,
    onLockPress,
    resetSettings,
    sensorType,
  };
};
