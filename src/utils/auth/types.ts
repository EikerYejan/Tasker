import type {IStoredUser} from "../../types";

// TODO: update methods and properties
export interface IAuthService {
  handleRedirectResult: () => Promise<IStoredUser | null>;
}
