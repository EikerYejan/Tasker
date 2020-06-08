import { Task, Dispatcher, Dispatch } from "@types"
import { getItem, saveItem } from "../utils/Storage"

/**
 * Action types
 */
const LAUNCH_APP = "LAUNCH_APP"
const CHANGE_THEME = "CHANGE_THEME"
const ADD_TASK = "ADD_TASK"
const REMOVE_TASK = "REMOVE_TASK"
const FINISH_TASK = "FINISH_TASK"

/* Localstorage theme ref */
const THEME_REF = "tasker_theme"

/**
 * Launch app
 */
const launchApp = () => (dispatch: Dispatch): void => {
  // Get theme
  const theme = getItem(THEME_REF) ?? "dark"

  // Dispatch
  dispatch({ type: LAUNCH_APP, payload: { theme } })
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

export {
  launchApp,
  changeTheme,
  addTask,
  deleteTask,
  finishTask,
  LAUNCH_APP,
  CHANGE_THEME,
  ADD_TASK,
  REMOVE_TASK,
  FINISH_TASK,
}
