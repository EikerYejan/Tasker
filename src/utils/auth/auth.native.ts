import {firebase} from "@react-native-firebase/app-check";
import appleAuth from "@invertase/react-native-apple-authentication";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import auth, {type FirebaseAuthTypes} from "@react-native-firebase/auth";

import {ANDROID_APP_CHECK_DEBUG_TOKEN, IOS_APP_CHECK_DEBUG_TOKEN} from "@env";
import {SocialLoginProvider} from "../../types";

const dev = process.env.NODE_ENV === "development";

class AuthServiceBase {
  private unsubscribeAuthState: (() => void) | null = null;

  private hasPlayServices: boolean | null = null;

  private sendEmailVerification = async () => {
    await auth()
      .currentUser?.sendEmailVerification()
      .catch(() => null);
  };

  private setupGoogleAuth = async () => {
    GoogleSignin.configure({
      webClientId:
        "1005272971972-3reer316h170v0fvktsok165ri03o4om.apps.googleusercontent.com",
    });

    this.hasPlayServices = await GoogleSignin.hasPlayServices();
  };

  readonly isTwitterAuthSupported = false;

  readonly isGithubAuthSupported = false;

  get isAppleAuthSupported() {
    return appleAuth.isSupported;
  }

  get isGoogleAuthSupported() {
    return this.hasPlayServices;
  }

  init = async () => {
    await this.initializeAppCheck();
    await this.setupGoogleAuth();

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

      this.sendEmailVerification();

      return auth().currentUser;
    }

    const {user} = await auth().createUserWithEmailAndPassword(email, password);

    this.sendEmailVerification();

    return user;
  };

  signInWithApple = async () => {
    const {identityToken, nonce} = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!identityToken) {
      throw new Error("No identity token");
    }

    const credential = firebase.auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    if (auth().currentUser?.isAnonymous) {
      await auth()
        .currentUser?.linkWithCredential(credential)
        .catch(() => null);
    }

    await auth().signInWithCredential(credential);

    this.sendEmailVerification();

    return auth().currentUser;
  };

  signInWithGoogle = async () => {
    if (!this.hasPlayServices) {
      throw new Error("No play services");
    }

    const {idToken} = await GoogleSignin.signIn();
    const credential = auth.GoogleAuthProvider.credential(idToken);

    if (auth().currentUser?.isAnonymous) {
      await auth()
        .currentUser?.linkWithCredential(credential)
        .catch(() => null);
    }

    await auth().signInWithCredential(credential);

    this.sendEmailVerification();

    return auth().currentUser;
  };

  signInWithProvider = (provider: SocialLoginProvider) => {
    switch (provider) {
      case SocialLoginProvider.APPLE:
        return this.signInWithApple();
      case SocialLoginProvider.GOOGLE:
        return this.signInWithGoogle();
      default: {
        throw Error("Invalid provider");
      }
    }
  };

  sendPasswordResetEmail = async (email: string) => {
    await auth()
      .sendPasswordResetEmail(email)
      .catch(() => null);
  };

  getLoginMethodsForEmail = async (email: string) => {
    const methods = await auth().fetchSignInMethodsForEmail(email);

    return methods ?? [];
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
