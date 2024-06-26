import {
  createUserWithEmailAndPassword,
  deleteUser as deleteCurrentUser,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  OAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  TwitterAuthProvider,
} from "firebase/auth";
import {WebFirebaseService} from "../webFirebaseService";

import {
  WEB_ENABLE_APPLE_AUTH,
  WEB_ENABLE_GITHUB_AUTH,
  WEB_ENABLE_GOOGLE_AUTH,
  WEB_ENABLE_TWITTER_AUTH,
} from "@env";

import {type IStoredUser, SocialLoginProvider} from "../../types";

const providersMap = {
  [SocialLoginProvider.APPLE]: OAuthProvider,
  [SocialLoginProvider.GOOGLE]: GoogleAuthProvider,
  [SocialLoginProvider.TWITTER]: TwitterAuthProvider,
  [SocialLoginProvider.GITHUB]: GithubAuthProvider,
};

class AuthServiceBase {
  private unsubscribeAuthState: (() => void) | null = null;

  private readonly app = WebFirebaseService.firebaseApp;

  private get auth() {
    return getAuth(this.app);
  }

  private getLoginProvider = (provider: SocialLoginProvider) => {
    const Provider = providersMap[provider];

    if (!Provider) {
      throw Error("Unknown provider");
    }

    return Provider;
  };

  private get isEndToEndTesting() {
    return typeof window !== "undefined" && (window as any).Cypress;
  }

  private logEndToEndTestingUser = () => {
    const {Cypress} = window as any;

    if (!Cypress) return;

    const email = String(Cypress.env("TEST_USER_EMAIL"));
    const password = String(Cypress.env("TEST_USER_PASSWORD"));

    console.log("Logging in with end-to-end testing user", email, password);

    return this.signInWithEmailAndPassword(email, password);
  };

  get isAppleAuthSupported() {
    return Boolean(WEB_ENABLE_APPLE_AUTH);
  }

  get isGoogleAuthSupported() {
    return Boolean(WEB_ENABLE_GOOGLE_AUTH);
  }

  get isTwitterAuthSupported() {
    return Boolean(WEB_ENABLE_TWITTER_AUTH);
  }

  get isGithubAuthSupported() {
    return Boolean(WEB_ENABLE_GITHUB_AUTH);
  }

  init = async () => {
    await this.auth.authStateReady();

    if (this.isEndToEndTesting) {
      return this.logEndToEndTestingUser();
    }

    if (this.auth.currentUser) {
      return this.auth.currentUser as IStoredUser;
    }

    return null;
  };

  signInAnonymously = async () => {
    if (this.auth.currentUser) await this.auth.signOut();

    const {user} = await signInAnonymously(this.auth);

    return user;
  };

  signInWithEmailAndPassword = async (email: string, password: string) => {
    const {user} = await signInWithEmailAndPassword(this.auth, email, password);

    return user;
  };

  signUpWithEmailAndPassword = async (email: string, password: string) => {
    if (this.auth.currentUser) {
      const credential = EmailAuthProvider.credential(email, password);

      await linkWithCredential(this.auth.currentUser, credential);
      await signInWithCredential(this.auth, credential);

      sendEmailVerification(this.auth.currentUser).catch(() => null);

      return this.auth.currentUser;
    }

    const {user} = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );

    sendEmailVerification(user).catch(() => null);

    return user;
  };

  signInWithProvider = async (providerName: SocialLoginProvider) => {
    const Provider = this.getLoginProvider(providerName);
    const providerInstance = new Provider("apple.com");
    const isAnonymous = this.auth.currentUser?.isAnonymous;

    providerInstance.addScope("email");

    const result = await signInWithPopup(this.auth, providerInstance);
    const credential = Provider.credentialFromResult(result);

    if (!credential) {
      throw Error("No credential");
    }

    if (isAnonymous) {
      await linkWithCredential(this.auth.currentUser, credential);
    } else {
      await signInWithCredential(this.auth, credential);
    }

    return this.auth.currentUser;
  };

  sendPasswordResetEmail = async (email: string) => {
    await sendPasswordResetEmail(this.auth, email).catch(() => null);
  };

  getLoginMethodsForEmail = async (email: string) => {
    const methods = await fetchSignInMethodsForEmail(this.auth, email);

    return methods ?? [];
  };

  logOutUser = async () => {
    await this.auth.signOut();
  };

  deleteUser = () => {
    if (!this.auth.currentUser) return Promise.reject(Error("No user"));

    return deleteCurrentUser(this.auth.currentUser);
  };

  listenToAuthState = (cb: (user: IStoredUser | null) => void) => {
    const unsubscribe = this.auth.onIdTokenChanged(result => {
      const user = result as IStoredUser;

      cb?.(user);
    });

    this.unsubscribeAuthState = unsubscribe;

    return unsubscribe;
  };

  stopListeningToAuthState = () => {
    if (this.unsubscribeAuthState) this.unsubscribeAuthState();
  };

  getCurrentUser = () => {
    return this.auth.currentUser;
  };
}

export const AuthService = new AuthServiceBase();
