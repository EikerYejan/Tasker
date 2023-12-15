import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { MMKV } from "react-native-mmkv";

export interface ITodoItem {
  description: string;
  done?: boolean;
  id: string;
  title: string;
}

export interface IAppStore {
  done: ITodoItem[];
  loggedIn: boolean;
  name: string;
  todos: ITodoItem[];
}

const storage = new MMKV();
const storageAdapter = {
  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    return storage.set(key, value);
  },
};

const { persistAtom } = recoilPersist({
  key: "appStore",
  storage: storageAdapter,
});

export const appStore = atom<IAppStore>({
  key: "appStore",
  default: {
    done: [],
    loggedIn: false,
    name: "",
    todos: [],
  },
  effects_UNSTABLE: [persistAtom],
});

export const useAppState = () => {
  const [state, setState] = useRecoilState(appStore);

  const addTodo = (todo: ITodoItem) => {
    setState((prevState) => ({
      ...prevState,
      todos: [todo, ...prevState.todos],
    }));
  };

  const removeTodo = (id: string, done = false) => {
    setState((prevState) => {
      const items = done ? prevState.done : prevState.todos;
      const key = done ? "done" : "todos";

      return {
        ...prevState,
        [key]: items.filter((todo) => todo.id !== id),
      };
    });
  };

  const markAsDone = (id: string) => {
    const todo = state.todos.find((todo) => todo.id === id);

    if (todo) {
      const newItem = { ...todo, done: true };

      setState((prevState) => ({
        ...prevState,
        done: [newItem, ...prevState.done],
        todos: prevState.todos.filter((todo) => todo.id !== id),
      }));
    }
  };

  const markAsTodo = (id: string) => {
    const todo = state.done.find((todo) => todo.id === id);

    if (todo) {
      const newItem = { ...todo, done: false };

      setState((prevState) => ({
        ...prevState,
        done: prevState.done.filter((todo) => todo.id !== id),
        todos: [newItem, ...prevState.todos],
      }));
    }
  };

  const setName = (name: string) => {
    setState((prevState) => ({
      ...prevState,
      loggedIn: true,
      name,
    }));
  };

  const resetState = () => {
    setState({
      done: [],
      loggedIn: false,
      name: "",
      todos: [],
    });
  };

  return {
    addTodo,
    markAsDone,
    markAsTodo,
    removeTodo,
    resetState,
    setName,
    state,
  };
};
