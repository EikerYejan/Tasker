import {firebase} from "@react-native-firebase/app-check";
import auth, {type FirebaseAuthTypes} from "@react-native-firebase/auth";

import {IOS_APP_CHECK_DEBUG_TOKEN} from "@env";

import type {IStoredUser} from "../../types";

export const initializeAuth = async () => {
  await initializeAppCheck();

  return auth().currentUser;
};

export const signInAnonymously = async () => {
  if (auth().currentUser) await auth().signOut();

  const {user} = await auth().signInAnonymously();
  return user;
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  if (auth().currentUser) await auth().signOut();

  const {user} = await auth().signInWithEmailAndPassword(email, password);

  return user;
};

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  if (auth().currentUser) await auth().signOut();

  const {user} = await auth().createUserWithEmailAndPassword(email, password);

  await user.sendEmailVerification();

  return user;
};

export const getIsEmailUsed = async (email: string) => {
  const methods = await auth().fetchSignInMethodsForEmail(email);

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

export const getCurrentUser = () => {
  return auth().currentUser;
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
