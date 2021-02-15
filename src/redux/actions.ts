import { Task, Dispatcher, Dispatch } from '@types'
import { getItem, saveItem, getAppData } from '../utils/Storage'
import {
  ADD_TASK,
  REMOVE_TASK,
  FINISH_TASK,
  LAUNCH_APP,
  CHANGE_THEME,
  NAME_REF,
  EDIT_TASK,
  RESTORE_TASK,
  DRAG_TASK,
} from './constants'

/**
 * Launch app
 */
const launchApp = () => (dispatch: Dispatch): void => {
  // Get username
  const username = getItem(NAME_REF)

  if (!username) {
    return dispatch({ type: LAUNCH_APP, payload: { isRegistered: false } })
  }

  // Get app data
  const { theme, todo = [], done = [] } = getAppData()

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

  // Dispatch
  dispatch({
    type: LAUNCH_APP,
    payload: { username, isRegistered: true },
  })
}

/**
 * Change UI theme
 * @param currentTheme
 */
const changeTheme: Dispatcher<string> = (currentTheme) => (dispatch): void => {
  // Save theme
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

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

/**
 * Edit task
 */
const editTask: Dispatcher<Task> = (task) => (dispatch): void =>
  dispatch({ type: EDIT_TASK, payload: task })

/**
 * Restore task
 * @param task
 */
const restoreTask: Dispatcher<Task> = (task) => (dispatch): void =>
  dispatch({ type: RESTORE_TASK, payload: task })

/**
 * Update tasks when dragging
 */
const updateDrag: Dispatcher<Task[]> = (tasks) => (dispatch): void =>
  dispatch({ type: DRAG_TASK, payload: tasks })

export {
  launchApp,
  changeTheme,
  addTask,
  deleteTask,
  finishTask,
  saveUser,
  editTask,
  restoreTask,
  updateDrag,
}
