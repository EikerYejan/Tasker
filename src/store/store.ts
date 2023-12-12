import { atom, useRecoilState } from "recoil";

export interface ITodoItem {
  description: string;
  id: string;
  title: string;
}

export interface IAppStore {
  done: ITodoItem[];
  name: string;
  todos: ITodoItem[];
}

export const appStore = atom<IAppStore>({
  key: "appStore",
  default: {
    done: [],
    name: "",
    todos: [],
  },
});

export const useAppState = () => {
  const [state, setState] = useRecoilState(appStore);

  const addTodo = (todo: ITodoItem) => {
    setState((prevState) => ({
      ...prevState,
      todos: [...prevState.todos, todo],
    }));
  };

  const removeTodo = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      todos: prevState.todos.filter((todo) => todo.id !== id),
    }));
  };

  const markAsDone = (id: string) => {
    const todo = state.todos.find((todo) => todo.id === id);

    if (todo) {
      setState((prevState) => ({
        ...prevState,
        done: [...prevState.done, todo],
        todos: prevState.todos.filter((todo) => todo.id !== id),
      }));
    }
  };

  const markAsTodo = (id: string) => {
    const todo = state.done.find((todo) => todo.id === id);

    if (todo) {
      setState((prevState) => ({
        ...prevState,
        done: prevState.done.filter((todo) => todo.id !== id),
        todos: [...prevState.todos, todo],
      }));
    }
  };

  const setName = (name: string) => {
    setState((prevState) => ({
      ...prevState,
      name,
    }));
  };

  return {
    addTodo,
    markAsDone,
    markAsTodo,
    removeTodo,
    setName,
    state,
  };
};
