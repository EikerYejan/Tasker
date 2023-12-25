import "@react-navigation/native";

declare module "@react-navigation/native" {
  interface Theme {
    dark: boolean;
    colors: {
      background: string;
      border: string;
      card: string;
      error: string;
      notification: string;
      primary: string;
      primaryInverse: string;
      text: string;
    };
  }
}
