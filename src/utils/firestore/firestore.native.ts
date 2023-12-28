import firestore, {
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import {Platform} from "react-native";
import DeviceInfo from "react-native-device-info";

import {AuthService} from "../auth/auth";
import {getInitialState} from "../../store/constants";
import {toStoredUser} from "..";

import {COLLECTION_NAME} from "./constants";
import {version} from "../../../package.json";

import type {IAppStore} from "../../types";

class FirestoreServiceBase {
  private instance: FirebaseFirestoreTypes.DocumentReference<IAppStore> | null =
    null;

  private unsubscribe: (() => void) | null = null;

  private stateChangeListener: ((data?: IAppStore) => void) | null = null;

  async init() {
    const user = AuthService.getCurrentUser();

    if (user) {
      const instance = firestore().collection(COLLECTION_NAME).doc(user.uid);
      const document = await instance.get();

      this.instance =
        instance as FirebaseFirestoreTypes.DocumentReference<IAppStore>;

      if (!document.data()) {
        await instance.set(
          this.sanitizeData({
            user: toStoredUser(user),
            ...getInitialState(),
            ...this.documentMetadata,
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

    if (this.unsubscribe) this.unsubscribe();

    await this.init();

    if (this.stateChangeListener) {
      this.listenForChanges(this.stateChangeListener);
    }
  };

  sanitizeData = <T extends Record<string, unknown>>(data: T) => {
    return JSON.parse(JSON.stringify(data)) as T;
  };

  setDocumentData = async (data: Partial<IAppStore>) => {
    if (this.instance) {
      await this.instance.update({
        ...this.sanitizeData(data),
        ...this.documentMetadata,
        theme: null,
      });
    }
  };

  deleteDocument = async () => {
    if (this.instance) {
      await this.instance.delete();
    }
  };

  listenForChanges = async (callback: (data?: IAppStore) => void) => {
    this.stateChangeListener = callback;

    if (this.instance) {
      this.unsubscribe = this.instance.onSnapshot(snapshot => {
        const data = snapshot.data();
        callback(data);
      });
    }
  };

  stopListeningForChanges = () => {
    if (this.unsubscribe) {
      this.stateChangeListener = null;

      this.unsubscribe();
    }
  };
}

export const FirestoreService = new FirestoreServiceBase();
