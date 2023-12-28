import {
  createUserWithEmailAndPassword,
  deleteUser as deleteCurrentUser,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  linkWithCredential,
  OAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {WebFirebaseService} from "../webFirebaseService";

import {WEB_ENABLE_APPLE_AUTH} from "@env";

import type {IStoredUser} from "../../types";

class AuthServiceBase {
  private unsubscribeAuthState: (() => void) | null = null;

  private readonly app = WebFirebaseService.firebaseApp;

  private get auth() {
    return getAuth(this.app);
  }

  get isAppleAuthSupported() {
    return Boolean(WEB_ENABLE_APPLE_AUTH);
  }

  init = async () => {
    await this.auth.authStateReady();

    if (this.auth.currentUser) {
      return this.auth.currentUser;
    }
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

    await sendEmailVerification(user).catch(() => null);

    return user;
  };

  signInWithApple = async () => {
    const provider = new OAuthProvider("apple.com");

    provider.addScope("email");

    const result = await signInWithPopup(this.auth, provider);
    const credential = OAuthProvider.credentialFromResult(result);

    if (!credential) {
      throw Error("No credential");
    }

    if (this.auth.currentUser?.isAnonymous) {
      await linkWithCredential(this.auth.currentUser, credential);
    }

    await signInWithCredential(this.auth, credential);

    return this.auth.currentUser;
  };

  sendPasswordResetEmail = async (email: string) => {
    await sendPasswordResetEmail(this.auth, email);
  };

  getIsEmailUsed = async (email: string) => {
    const methods = await fetchSignInMethodsForEmail(this.auth, email);

    return methods.length > 0;
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
