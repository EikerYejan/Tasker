import { Dispatch, Task } from "@types"

/**
 * Action types
 */
const ADD_TASK = "ADD_TASK"

/**
 * Add task
 * @param task - Task
 */
const addTask = (task: Task) => (dispatch: Dispatch): void =>
  dispatch({ type: ADD_TASK, payload: task })

export { addTask, ADD_TASK }
