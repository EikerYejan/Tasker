import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  sendEmailVerification,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {WebFirebaseService} from "../webFirebaseService";

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

  // TODO: add type
  listenToAuthState = (cb: (user: any | null) => void) => {
    const unsubscribe = this.auth.onAuthStateChanged(result => {
      cb?.(result);
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
