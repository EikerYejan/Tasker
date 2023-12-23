import {
  type DocumentReference,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import DeviceInfo from "react-native-device-info";
import {Platform} from "react-native";

import {AuthService} from "../auth/auth";
import {WebFirebaseService} from "../webFirebaseService";
import {getInitialState} from "../../store/constants";

import {version} from "../../../package.json";

import type {IAppStore} from "../../types";

class FirestoreServiceBase {
  private readonly app = WebFirebaseService.firebaseApp;

  private instance: DocumentReference<IAppStore, IAppStore> | null = null;

  private unsubscribe: (() => void) | null = null;

  private get db() {
    return getFirestore(this.app);
  }

  async init() {
    const user = AuthService.getCurrentUser();

    if (user) {
      const document = doc(this.db, "users", user.uid);
      const item = await getDoc(document);

      this.instance = document as typeof this.instance;

      if (!item.data()) {
        await setDoc(document, {});

        await this.setDocumentData(getInitialState());
      }
    }
  }

  get instanceRef() {
    return this.instance;
  }

  get instanceId() {
    return this.instance?.id;
  }

  private get documentMetadata() {
    return {
      appVersion: version,
      build: DeviceInfo.getBuildNumber() ?? null,
      platform: Platform.OS,
      updatedAt: serverTimestamp(),
    };
  }

  replaceInstance = async () => {
    this.instance = null;

    if (this.unsubscribe) this.unsubscribe();

    await this.init();
  };

  sanitizeData = <T extends Record<string, unknown>>(data: T) => {
    return JSON.parse(JSON.stringify(data)) as T;
  };

  setDocumentData = async (data: Partial<IAppStore>) => {
    if (this.instance) {
      await updateDoc(this.instance, {
        ...this.sanitizeData(data),
        ...this.documentMetadata,
      });
    }
  };

  listenForChanges = async (callback: (data?: IAppStore) => void) => {
    if (!this.instance) return;

    this.unsubscribe = onSnapshot(this.instance, snapshot => {
      callback(snapshot.data());
    });
  };

  stopListeningForChanges = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };
}

export const FirestoreService = new FirestoreServiceBase();
