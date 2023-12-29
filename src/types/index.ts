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
  theme?: {
    setByUser: boolean;
    value: ColorSchemeName;
  } | null;
  todos: ITodoItem[];
  /**
   * @deprecated
   */
  platform?: string;
  platforms?: string[];
}

export type IStoredUser = Pick<
  FirebaseAuthTypes.User,
  | "displayName"
  | "email"
  | "emailVerified"
  | "isAnonymous"
  | "phoneNumber"
  | "photoURL"
  | "providerData"
  | "providerId"
  | "uid"
> & {
  metadata: {
    createdAt?: string;
    creationTime?: string;
    lastLoginAt?: string;
    lastSignInTime?: string;
  };
  multiFactor?: Pick<FirebaseAuthTypes.User, "multiFactor">;
  onBoardingComplete?: boolean;
};

export enum SocialLoginProvider {
  APPLE = "apple",
  GOOGLE = "google",
}
