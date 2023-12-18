import {firebase} from "@react-native-firebase/app-check";
import auth, {type FirebaseAuthTypes} from "@react-native-firebase/auth";

import {IOS_APP_CHECK_DEBUG_TOKEN} from "@env";
import type {IStoredUser} from "../types";

export const initializeFirebase = async () => {
  try {
    await initializeAppCheck();

    let user = auth().currentUser;

    if (!user) {
      user = (await auth().signInAnonymously()).user;
    }

    return user;
  } catch (error) {
    console.error(error);
  }
};

const initializeAppCheck = () => {
  const rnfbProvider = firebase
    .appCheck()
    .newReactNativeFirebaseAppCheckProvider();

  rnfbProvider.configure({
    android: {
      provider: __DEV__ ? "debug" : "playIntegrity",
      debugToken: "TODO",
    },
    apple: {
      provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
      debugToken: IOS_APP_CHECK_DEBUG_TOKEN,
    },
    /*   web: {
      provider: "reCaptchaV3",
      siteKey: "unknown",
    }, */
  });

  return firebase.appCheck().initializeAppCheck({
    provider: rnfbProvider,
    isTokenAutoRefreshEnabled: true,
  });
};

export const toStoredUser = (user: FirebaseAuthTypes.User): IStoredUser => {
  const {
    displayName,
    email,
    emailVerified,
    isAnonymous,
    metadata,
    multiFactor,
    phoneNumber,
    photoURL,
    providerData,
    providerId,
    uid,
  } = user;

  return {
    displayName,
    email,
    emailVerified,
    isAnonymous,
    metadata,
    multiFactor,
    phoneNumber,
    photoURL,
    providerData,
    providerId,
    uid,
  };
};
