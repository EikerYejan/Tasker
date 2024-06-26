import {useCallback} from "react";
import {atom, useRecoilState} from "recoil";
import {recoilPersist} from "recoil-persist";

import {AuthService} from "../utils/auth/auth";
import {FirestoreService} from "../utils/firestore/firestore";
import {getInitialState} from "./constants";
import {toStoredUser} from "../utils";
import {storage} from "./storage";

import type {FirebaseAuthTypes} from "@react-native-firebase/auth";
import type {IAppStore, IStoredUser, ITodoItem} from "../types";

const {persistAtom} = recoilPersist({
  storage: {
    getItem(key) {
      const value = storage.getString(key);

      return value ? JSON.parse(value) : null;
    },
    setItem(key, value) {
      storage.set(key, JSON.stringify(value));
    },
  },
});

export const appStore = atom<IAppStore>({
  key: "appStore",
  default: getInitialState(),
  effects_UNSTABLE: [persistAtom],
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
    // TODO: Auth or Firestore service should not be used here
    await AuthService.logOutUser();
    await FirestoreService.replaceInstance();

    setState({
      ...getInitialState(),
      theme: state.theme,
      biometrics: state.biometrics,
    });
  };

  const setUser = async (user: FirebaseAuthTypes.User | null) => {
    setState(prevState => ({
      ...prevState,
      user: user ? toStoredUser(user) : undefined,
    }));

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

  const setStateFromFirestore = useCallback(
    async (snapshot: IAppStore) => {
      const {biometrics: __, theme: _, ...rest} = snapshot;

      setState(prevState => ({
        ...prevState,
        ...rest,
        biometrics: prevState.biometrics,
        theme: prevState.theme,
      }));
    },
    [state],
  );

  const getItem = (id: string) => {
    return state.todos.find(todo => todo.id === id);
  };

  const saveItem = async (item: ITodoItem) => {
    const newState: IAppStore = {
      ...state,
      todos: state.todos.map(todo => (todo.id === item.id ? item : todo)),
    };

    await FirestoreService.setDocumentData(newState);
  };

  return {
    addTodo,
    getItem,
    markAsDone,
    markAsTodo,
    removeTodo,
    resetState,
    saveItem,
    setState,
    setStateFromFirestore,
    setUser,
    state,
    updateUser,
  };
};
