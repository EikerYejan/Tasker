import {atom, useRecoilState} from "recoil";

import {AuthService} from "../utils/auth/auth";
import {FirestoreService} from "../utils/firestore/firestore";
import {getInitialState} from "./constants";
import {toStoredUser} from "../utils";

import type {FirebaseAuthTypes} from "@react-native-firebase/auth";
import type {IAppStore, IStoredUser, ITodoItem} from "../types";
import {type ColorSchemeName} from "react-native";

export const appStore = atom<IAppStore>({
  key: "appStore",
  default: getInitialState(),
});

export const useAppState = () => {
  const [state, setState] = useRecoilState(appStore);

  const addTodo = async (todo: ITodoItem) => {
    await FirestoreService.setDocumentData({todos: [todo, ...state.todos]});
  };

  const removeTodo = async (id: string, done = false) => {
    const items = done ? state.done : state.todos;
    const key = done ? "done" : "todos";

    const newState = {
      ...state,
      [key]: items.filter(todo => todo.id !== id),
    };

    await FirestoreService.setDocumentData(newState);
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

      await FirestoreService.setDocumentData(newState);
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

      await FirestoreService.setDocumentData(newState);
    }
  };

  const resetState = async () => {
    await AuthService.logOutUser();
    await FirestoreService.replaceInstance();

    setState(getInitialState());
  };

  const setTheme = async (theme: ColorSchemeName, setByUser = false) => {
    await FirestoreService.setDocumentData({theme: {setByUser, value: theme}});
  };

  const setUser = async (user: FirebaseAuthTypes.User | null) => {
    await FirestoreService.setDocumentData({
      user: user ? toStoredUser(user) : undefined,
    });
  };

  const updateUser = async (data: Partial<IStoredUser> = {}) => {
    const user = {...data, ...state.user};

    await FirestoreService.setDocumentData({
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
