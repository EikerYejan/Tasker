import type {FirebaseAuthTypes} from "@react-native-firebase/auth";
import type {IStoredUser} from "../types";

export const generateId = () => {
  return Date.now(); //! unique-ish for now
};

export const isEmailValid = (email: string) => {
  return !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const toStoredUser = (user: FirebaseAuthTypes.User): IStoredUser => {
  const {
    displayName,
    email,
    emailVerified,
    isAnonymous,
    metadata,
    multiFactor,
    phoneNumber,
    photoURL,
    providerData,
    providerId,
    uid,
  } = user;

  return {
    displayName,
    email,
    emailVerified,
    isAnonymous,
    metadata,
    multiFactor,
    phoneNumber,
    photoURL,
    providerData,
    providerId,
    uid,
  };
};
