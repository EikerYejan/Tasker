import {
  type DocumentReference,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import DeviceInfo from "react-native-device-info";
import {Platform} from "react-native";

import {AuthService} from "../auth/auth";
import {WebFirebaseService} from "../webFirebaseService";
import {getInitialState} from "../../store/constants";

import {version} from "../../../package.json";

import type {IAppStore} from "../../types";
import {toStoredUser} from "..";

class FirestoreServiceBase {
  private readonly app = WebFirebaseService.firebaseApp;

  private instance: DocumentReference<IAppStore, IAppStore> | null = null;

  private unsubscribe: (() => void) | null = null;

  private stateChangeListener: ((data?: IAppStore) => void) | null = null;

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
        await setDoc(
          document,
          this.sanitizeData({
            user: toStoredUser(user),
            ...getInitialState(),
            ...(await this.documentMetadata()),
          }),
        );
      }
    }
  }

  get instanceRef() {
    return this.instance;
  }

  get instanceId() {
    return this.instance?.id;
  }

  private async documentMetadata() {
    return {
      appVersion: version,
      platform: Platform.OS,
      updatedAt: serverTimestamp(),
      userAgen: await DeviceInfo.getUserAgent(),
    };
  }

  replaceInstance = async () => {
    this.instance = null;

    if (this.unsubscribe) this.unsubscribe();

    await this.init();

    if (this.stateChangeListener) {
      this.listenForChanges(this.stateChangeListener);
    }
  };

  sanitizeData = <T extends Record<string, unknown>>(data: T) => {
    return JSON.parse(JSON.stringify(data)) as T;
  };

  getPlatforms = (platforms?: string | string[] | undefined) => {
    const existingPlatforms = (
      Array.isArray(platforms) ? platforms : [platforms]
    ).filter(Boolean) as string[];

    return [...new Set([...existingPlatforms, Platform.OS])];
  };

  setDocumentData = async (data: Partial<IAppStore>) => {
    if (this.instance) {
      await updateDoc(this.instance, {
        ...this.sanitizeData(data),
        ...(await this.documentMetadata()),
        platforms: this.getPlatforms(data?.platforms ?? data.platform),
      });
    }
  };

  deleteDocument = async () => {
    if (this.instance) {
      await deleteDoc(this.instance);
    }
  };

  listenForChanges = async (callback: (data?: IAppStore) => void) => {
    this.stateChangeListener = callback;

    if (!this.instance) return;

    this.unsubscribe = onSnapshot(this.instance, snapshot => {
      callback(snapshot.data());
    });
  };

  stopListeningForChanges = () => {
    if (this.unsubscribe) {
      this.stateChangeListener = null;

      this.unsubscribe();
    }
  };
}

export const FirestoreService = new FirestoreServiceBase();
