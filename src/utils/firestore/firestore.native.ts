import firestore from "@react-native-firebase/firestore";

import {getCurrentUser} from "../auth/auth";
import {getInitialState} from "../../store/constants";

import {COLLECTION_NAME} from "./constants";

import type {IAppStore} from "../../types";

const getDocumentInstance = async () => {
  const user = getCurrentUser();

  if (user) {
    const instance = firestore().collection(COLLECTION_NAME).doc(user.uid);
    const document = await instance.get();

    if (!document.data()) {
      await instance.set(getInitialState());
    }

    return {instance, document};
  }

  return {instance: null, document: null};
};

export const getOrCreateDocumentInstance = async () => {
  const user = getCurrentUser();

  if (!user) return undefined;

  const {instance} = await getDocumentInstance();

  if (instance && user) {
    await instance.update({userId: user.uid});

    return instance;
  }
};

export const setDocumentData = async (data: Partial<IAppStore>) => {
  const {instance} = await getDocumentInstance();

  if (instance) {
    await instance.update(data);
  }
};
