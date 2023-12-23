import {firebase} from "@react-native-firebase/app-check";
import auth, {type FirebaseAuthTypes} from "@react-native-firebase/auth";

import {IOS_APP_CHECK_DEBUG_TOKEN} from "@env";

class AuthServiceBase {
  private unsubscribeAuthState: (() => void) | null = null;

  init = async () => {
    await this.initializeAppCheck();

    return auth().currentUser;
  };

  signInAnonymously = async () => {
    if (auth().currentUser) await auth().signOut();

    const {user} = await auth().signInAnonymously();
    return user;
  };

  signInWithEmailAndPassword = async (email: string, password: string) => {
    if (auth().currentUser) await auth().signOut();

    const {user} = await auth().signInWithEmailAndPassword(email, password);

    return user;
  };

  signUpWithEmailAndPassword = async (email: string, password: string) => {
    if (auth().currentUser) await auth().signOut();

    const {user} = await auth().createUserWithEmailAndPassword(email, password);

    await user.sendEmailVerification();

    return user;
  };

  getIsEmailUsed = async (email: string) => {
    const methods = await auth().fetchSignInMethodsForEmail(email);

    return methods.length > 0;
  };

  logOutUser = async () => {
    await auth().signOut();
  };

  listenToAuthState = (cb: (user: FirebaseAuthTypes.User | null) => void) => {
    const unsubscribe = auth().onAuthStateChanged(result => {
      cb?.(result);
    });

    this.unsubscribeAuthState = unsubscribe;

    return unsubscribe;
  };

  stopListeningToAuthState = () => {
    if (this.unsubscribeAuthState) this.unsubscribeAuthState();
  };

  getCurrentUser = () => {
    return auth().currentUser;
  };

  initializeAppCheck = () => {
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
}

export const AuthService = new AuthServiceBase();
