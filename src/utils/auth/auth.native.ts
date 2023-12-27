import {firebase} from "@react-native-firebase/app-check";
import auth, {type FirebaseAuthTypes} from "@react-native-firebase/auth";

import {ANDROID_APP_CHECK_DEBUG_TOKEN, IOS_APP_CHECK_DEBUG_TOKEN} from "@env";

const dev = process.env.NODE_ENV === "development";

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
    const {currentUser} = auth();

    if (currentUser) {
      const credential = auth.EmailAuthProvider.credential(email, password);

      await currentUser.linkWithCredential(credential);
      await auth().signInWithCredential(credential);

      auth().currentUser?.sendEmailVerification();

      return auth().currentUser;
    }

    const {user} = await auth().createUserWithEmailAndPassword(email, password);

    user.sendEmailVerification();

    return user;
  };

  sendPasswordResetEmail = async (email: string) => {
    await auth().sendPasswordResetEmail(email);
  };

  getIsEmailUsed = async (email: string) => {
    const methods = await auth().fetchSignInMethodsForEmail(email);

    return methods.length > 0;
  };

  logOutUser = async () => {
    if (auth().currentUser) await auth().signOut();
  };

  deleteUser = () => {
    const user = auth().currentUser;

    if (!user) return Promise.reject(Error("No user"));

    return user.delete();
  };

  listenToAuthState = (cb: (user: FirebaseAuthTypes.User | null) => void) => {
    const unsubscribe = auth().onUserChanged(result => {
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
        provider: dev ? "debug" : "playIntegrity",
        debugToken: ANDROID_APP_CHECK_DEBUG_TOKEN,
      },
      apple: {
        provider: dev ? "debug" : "appAttestWithDeviceCheckFallback",
        debugToken: IOS_APP_CHECK_DEBUG_TOKEN,
      },
    });

    return firebase.appCheck().initializeAppCheck({
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });
  };
}

export const AuthService = new AuthServiceBase();
