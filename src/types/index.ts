import type {BiometryType} from "react-native-biometrics";
import type {ColorSchemeName} from "react-native";
import type {FirebaseAuthTypes} from "@react-native-firebase/auth";
import type {NavigationProp} from "@react-navigation/native";

export interface ITodoItem {
  description: string;
  done?: boolean;
  id: string;
  title: string;
}

export interface IBiometricsSettings {
  enrolled: boolean;
  locked: boolean;
  sensorType?: BiometryType;
  supported: boolean;
  timestamp: number;
}

export interface IAppStore {
  biometrics?: IBiometricsSettings;
  done: ITodoItem[];
  user?: IStoredUser;
  theme?: {
    setByUser: boolean;
    value: ColorSchemeName;
  } | null;
  todos: ITodoItem[];
  platforms?: string[];
  /**
   * @deprecated
   */
  platform?: string;
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
  GITHUB = "github",
  GOOGLE = "google",
  TWITTER = "twitter",
}

export enum ScreenName {
  HOME = "Home",
  LOGIN = "Login",
  MENU = "Menu",
  TASK = "Task",
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Screens = {
  [ScreenName.TASK]: {taskId?: string};
  [ScreenName.HOME]: undefined;
  [ScreenName.LOGIN]: undefined;
  [ScreenName.MENU]: undefined;
};

export type UseNavigation = NavigationProp<Screens>;
