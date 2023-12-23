import {WEB_RECAPTCHA_SITE_KEY} from "@env";
import {type FirebaseApp, initializeApp} from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

class WebFirebaseServiceBase {
  private readonly app: FirebaseApp = initializeApp({
    apiKey: "AIzaSyCkhhy1qS6w_lhrwdP3ERcmD5cHWszMJSE",
    authDomain: "taskszen.firebaseapp.com",
    projectId: "taskszen",
    storageBucket: "taskszen.appspot.com",
    messagingSenderId: "1005272971972",
    appId: "1:1005272971972:web:ceec2cae2c935abc3f6791",
    measurementId: "G-TC68RLP6MB",
  });

  constructor() {
    if (__DEV__) {
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(this.app, {
      provider: new ReCaptchaEnterpriseProvider(WEB_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  }

  get firebaseApp() {
    return this.app;
  }
}

export const WebFirebaseService = new WebFirebaseServiceBase();
