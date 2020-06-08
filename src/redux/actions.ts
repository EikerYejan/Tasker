import { Task, Dispatcher } from "@types"

/**
 * Action types
 */
const ADD_TASK = "ADD_TASK"
const REMOVE_TASK = "REMOVE_TASK"
const FINISH_TASK = "FINISH_TASK"

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

export { addTask, deleteTask, finishTask, ADD_TASK, REMOVE_TASK, FINISH_TASK }
