import {atom, useRecoilState} from "recoil";
import {recoilPersist} from "recoil-persist";
import {MMKV} from "react-native-mmkv";

import {logOutUser, toStoredUser} from "../utils/auth/auth";
import {setDocumentData} from "../utils/firestore/firestore";
import {getInitialState} from "./constants";

import type {FirebaseAuthTypes} from "@react-native-firebase/auth";
import type {IAppStore, IStoredUser, ITodoItem} from "../types";
import {type ColorSchemeName} from "react-native";

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

export const appStore = atom<IAppStore>({
  key: "appStore",
  default: getInitialState(),
  effects_UNSTABLE: [persistAtom],
});

export const useAppState = () => {
  const [state, setState] = useRecoilState(appStore);

  const addTodo = async (todo: ITodoItem) => {
    await setDocumentData({todos: [todo, ...state.todos]});
  };

  const removeTodo = async (id: string, done = false) => {
    const items = done ? state.done : state.todos;
    const key = done ? "done" : "todos";

    const newState = {
      ...state,
      [key]: items.filter(todo => todo.id !== id),
    };

    await setDocumentData(newState);
  };

  const markAsDone = async (id: string) => {
    const todo = state.todos.find(todo => todo.id === id);

    if (todo) {
      const newItem = {...todo, done: true};
      const newState = {
        ...state,
        done: [newItem, ...state.done],
        todos: state.todos.filter(t => t.id !== id),
      };

      await setDocumentData(newState);
    }
  };

  const markAsTodo = async (id: string) => {
    const todo = state.done.find(todo => todo.id === id);

    if (todo) {
      const newItem = {...todo, done: false};
      const newState = {
        ...state,
        done: state.done.filter(t => t.id !== id),
        todos: [newItem, ...state.todos],
      };

      await setDocumentData(newState);
    }
  };

  const resetState = async () => {
    await logOutUser();
    setState(getInitialState());
  };

  const setTheme = async (theme: ColorSchemeName, setByUser = false) => {
    await setDocumentData({theme: {setByUser, value: theme}});
  };

  const setUser = async (user: FirebaseAuthTypes.User | null) => {
    await setDocumentData({
      user: user
        ? {
            ...(state.user ? {...state.user} : {}),
            ...toStoredUser(user),
          }
        : undefined,
    });
  };

  const updateUser = async (data: Partial<IStoredUser> = {}) => {
    const user = {...data, ...state.user};

    await setDocumentData({
      user: user as IStoredUser,
    });
  };

  return {
    addTodo,
    markAsDone,
    markAsTodo,
    removeTodo,
    resetState,
    setState,
    setTheme,
    setUser,
    state,
    updateUser,
  };
};
