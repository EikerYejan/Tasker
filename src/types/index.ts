import type {FirebaseAuthTypes} from "@react-native-firebase/auth";
import type {ColorSchemeName} from "react-native";

export interface ITodoItem {
  description: string;
  done?: boolean;
  id: string;
  title: string;
}

export interface IAppStore {
  done: ITodoItem[];
  user?: IStoredUser;
  theme: {
    setByUser: boolean;
    value: ColorSchemeName;
  };
  todos: ITodoItem[];
}

export type IStoredUser = Pick<
  FirebaseAuthTypes.User,
  | "displayName"
  | "email"
  | "emailVerified"
  | "isAnonymous"
  | "metadata"
  | "multiFactor"
  | "phoneNumber"
  | "photoURL"
  | "providerData"
  | "providerId"
  | "uid"
> & {
  onBoardingComplete?: boolean;
};
