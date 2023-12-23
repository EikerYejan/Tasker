import {type FirebaseApp, initializeApp} from "firebase/app";

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

  get firebaseApp() {
    return this.app;
  }
}

export const WebFirebaseService = new WebFirebaseServiceBase();
