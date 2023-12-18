import {atom, useRecoilState} from "recoil";
import {recoilPersist} from "recoil-persist";
import {MMKV} from "react-native-mmkv";
import {Appearance, type ColorSchemeName} from "react-native";

import {logOutUser, toStoredUser} from "../utils/firebase";

import type {FirebaseAuthTypes} from "@react-native-firebase/auth";
import type {IAppStore, ITodoItem} from "../types";

export const storage = new MMKV();
const storageAdapter = {
  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
};

const {persistAtom} = recoilPersist({
  key: "appStore",
  storage: storageAdapter,
});

const defaultState = {
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
  loggedIn: false,
  name: "",
  todos: [
    {
      description: "Here you can add a description",
      done: false,
      id: "2",
      title: "This is a todo item",
    },
  ],
};

export const appStore = atom<IAppStore>({
  key: "appStore",
  default: defaultState,
  effects_UNSTABLE: [persistAtom],
});

export const useAppState = () => {
  const [state, setState] = useRecoilState(appStore);

  const addTodo = (todo: ITodoItem) => {
    setState(prevState => ({
      ...prevState,
      todos: [todo, ...prevState.todos],
    }));
  };

  const removeTodo = (id: string, done = false) => {
    setState(prevState => {
      const items = done ? prevState.done : prevState.todos;
      const key = done ? "done" : "todos";

      return {
        ...prevState,
        [key]: items.filter(todo => todo.id !== id),
      };
    });
  };

  const markAsDone = (id: string) => {
    const todo = state.todos.find(todo => todo.id === id);

    if (todo) {
      const newItem = {...todo, done: true};

      setState(prevState => ({
        ...prevState,
        done: [newItem, ...prevState.done],
        todos: prevState.todos.filter(t => t.id !== id),
      }));
    }
  };

  const markAsTodo = (id: string) => {
    const todo = state.done.find(todo => todo.id === id);

    if (todo) {
      const newItem = {...todo, done: false};

      setState(prevState => ({
        ...prevState,
        done: prevState.done.filter(t => t.id !== id),
        todos: [newItem, ...prevState.todos],
      }));
    }
  };

  const resetState = async () => {
    await logOutUser();
    setState(defaultState);
  };

  const setTheme = (theme: ColorSchemeName, setByUser = false) => {
    setState(prevState => ({
      ...prevState,
      theme: {setByUser, value: theme},
    }));
  };

  const setUser = (user: FirebaseAuthTypes.User | null) => {
    setState(prevState => ({
      ...prevState,
      user: user
        ? {...toStoredUser(user), onBoardingComplete: true}
        : undefined,
    }));
  };

  return {
    addTodo,
    markAsDone,
    markAsTodo,
    removeTodo,
    resetState,
    setTheme,
    setUser,
    state,
  };
};
