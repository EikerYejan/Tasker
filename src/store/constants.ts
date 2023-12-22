import {Appearance} from "react-native";

import type {IAppStore} from "../types";

const defaultState: IAppStore = {
  theme: {
    setByUser: false,
    value: Appearance.getColorScheme(),
  },
  done: [
    {
      description: "Here you can see what you have done",
      done: true,
      id: "1",
      title: "This is a done item",
    },
  ],
  todos: [
    {
      description: "Here you can add a description",
      done: false,
      id: "2",
      title: "This is a todo item",
    },
  ],
};

export const getInitialState = () => {
  return defaultState;
};
