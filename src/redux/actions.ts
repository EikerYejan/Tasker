import { Dispatch, Task } from "@types"

/**
 * Action types
 */
const ADD_TASK = "ADD_TASK"
const REMOVE_TASK = "REMOVE_TASK"

/**
 * Add task
 * @param task - Task
 */
const addTask = (task: Task) => (dispatch: Dispatch): void =>
  dispatch({ type: ADD_TASK, payload: task })

/**
 * Remove task
 * @param id
 */
const deleteTask = (id: number) => (dispatch: Dispatch): void =>
  dispatch({ type: REMOVE_TASK, payload: id })

export { addTask, deleteTask, ADD_TASK, REMOVE_TASK }
