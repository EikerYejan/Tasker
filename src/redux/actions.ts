import { Task, Dispatcher, Dispatch } from "@types"
import { getItem, saveItem } from "../utils/Storage"
import {
  ADD_TASK,
  REMOVE_TASK,
  FINISH_TASK,
  LAUNCH_APP,
  CHANGE_THEME,
  THEME_REF,
  TODOS_REF,
  DONE_REF,
  NAME_REF,
} from "./constants"

/**
 * Launch app
 */
const launchApp = () => (dispatch: Dispatch): void => {
  // Get username
  const username = getItem(NAME_REF)

  if (!username) {
    return dispatch({ type: LAUNCH_APP, payload: { isRegistered: false } })
  }

  // Get theme
  const theme = getItem(THEME_REF) ?? "dark"

  // Get tasks
  const todo = JSON.parse(getItem(TODOS_REF) ?? "[]")
  const done = JSON.parse(getItem(DONE_REF) ?? "[]")

  // Dispatch
  return dispatch({
    type: LAUNCH_APP,
    payload: { theme, todo, done, username, isRegistered: true },
  })
}

/**
 * Register user
 * @param name
 */
const saveUser: Dispatcher<string> = (username) => (dispatch): void => {
  // Save username
  saveItem(NAME_REF, username)

  // Get theme
  const theme = getItem(THEME_REF) ?? "dark"

  // Get tasks
  const todo = JSON.parse(getItem(TODOS_REF) ?? "[]")
  const done = JSON.parse(getItem(DONE_REF) ?? "[]")

  // Dispatch
  dispatch({
    type: LAUNCH_APP,
    payload: { theme, todo, done, username, isRegistered: true },
  })
}

/**
 * Change UI theme
 * @param currentTheme
 */
const changeTheme: Dispatcher<string> = (currentTheme) => (dispatch): void => {
  // Save theme
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  saveItem(THEME_REF, newTheme)

  // Dispatch
  dispatch({ type: CHANGE_THEME, payload: { theme: newTheme } })
}

/**
 * Add task
 * @param task - Task
 */
const addTask: Dispatcher<Task> = (task) => (dispatch): void =>
  dispatch({ type: ADD_TASK, payload: task })

/**
 * Remove task
 * @param id
 */
const deleteTask: Dispatcher<{ id: number; done: boolean }> = ({
  id,
  done,
}) => (dispatch): void => dispatch({ type: REMOVE_TASK, payload: { id, done } })

/**
 * Finish task
 */
const finishTask: Dispatcher<Task> = (task) => (dispatch): void =>
  dispatch({ type: FINISH_TASK, payload: task })

export { launchApp, changeTheme, addTask, deleteTask, finishTask, saveUser }
