import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  sendEmailVerification,
  signInAnonymously,
  signInWithEmailAndPassword,
  deleteUser as deleteCurrentUser,
} from "firebase/auth";
import {WebFirebaseService} from "../webFirebaseService";

import type {IStoredUser} from "../../types";

class AuthServiceBase {
  private unsubscribeAuthState: (() => void) | null = null;

  private readonly app = WebFirebaseService.firebaseApp;

  private get auth() {
    return getAuth(this.app);
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
    const {user} = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );

    await sendEmailVerification(user);

    return user;
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
    const unsubscribe = this.auth.onAuthStateChanged(result => {
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
