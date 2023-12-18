import {firebase} from "@react-native-firebase/app-check";
import auth, {type FirebaseAuthTypes} from "@react-native-firebase/auth";

import {IOS_APP_CHECK_DEBUG_TOKEN} from "@env";
import type {IStoredUser} from "../types";

export const initializeFirebase = async () => {
  await initializeAppCheck();
};

export const signInAnonymously = async () => {
  try {
    const {user} = await auth().signInAnonymously();
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const {user} = await auth().signInWithEmailAndPassword(email, password);

  return user;
};

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const {user} = await auth().createUserWithEmailAndPassword(email, password);

  await user.sendEmailVerification();

  return user;
};

export const getIsEmailUsed = async (email: string) => {
  const methods = await auth().fetchSignInMethodsForEmail(email);

  console.log("methods", methods);

  return methods.length > 0;
};

export const logOutUser = async () => {
  await auth().signOut();
};

export const listenToAuthState = (
  cb: (user: FirebaseAuthTypes.User | null) => void,
) => {
  return auth().onAuthStateChanged(result => {
    cb?.(result);
  });
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
