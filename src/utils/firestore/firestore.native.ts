import firestore, {
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import {Platform} from "react-native";
import DeviceInfo from "react-native-device-info";

import {AuthService} from "../auth/auth";
import {getInitialState} from "../../store/constants";

import {COLLECTION_NAME} from "./constants";
import {version} from "../../../package.json";

import type {IStoredUser, IAppStore} from "../../types";
import type {FirebaseAuthTypes} from "@react-native-firebase/auth";

class FirestoreServiceBase {
  private user: FirebaseAuthTypes.User | null = null;

  private instance: FirebaseFirestoreTypes.DocumentReference<IAppStore> | null =
    null;

  private unsubscribe: (() => void) | null = null;

  async init() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.user = user;

      const instance = firestore().collection(COLLECTION_NAME).doc(user.uid);
      const document = await instance.get();

      if (!document.data()) {
        await this.setDocumentData(getInitialState());
      }

      this.instance =
        instance as FirebaseFirestoreTypes.DocumentReference<IAppStore>;
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
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };
  }

  replaceInstance = async () => {
    this.instance = null;
    this.user = null;

    if (this.unsubscribe) this.unsubscribe();

    await this.init();
  };

  sanitizeData = <T extends Record<string, unknown>>(data: T) => {
    return JSON.parse(JSON.stringify(data)) as T;
  };

  getOrCreateDocumentInstance = async () => {
    if (!this.user) return undefined;

    if (this.instance) {
      await this.instance.update({
        user: this.sanitizeData<IStoredUser>(this.user),
      });
    }
  };

  setDocumentData = async (data: Partial<IAppStore>) => {
    if (this.instance) {
      await this.instance.update({
        ...this.sanitizeData(data),
        ...this.documentMetadata,
      });
    }
  };

  listenForChanges = async (callback: (data?: IAppStore) => void) => {
    if (this.instance) {
      this.unsubscribe = this.instance.onSnapshot(snapshot => {
        const data = snapshot.data();
        callback(data);
      });
    }
  };

  stopListeningForChanges = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };
}

export const FirestoreService = new FirestoreServiceBase();
