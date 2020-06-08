import { Action, AppState, Obj, ValueOf } from "@types"
import { ADD_TASK, REMOVE_TASK, FINISH_TASK } from "./actions"

/**
 * Update object
 */
const updateObj = <T extends Obj>(oldObj: T, newObj: Partial<T>): T => ({
  ...oldObj,
  ...newObj,
})

/**
 * Remove from array
 */
const removeFromArray = <T extends Obj, U extends keyof T>(
  el: T[],
  search: U,
  value: ValueOf<T>
): T[] => {
  for (let i = 0; i < el.length; i += 1) {
    const item = el[i]

    if (item[search] === value) el.splice(i, 1)
  }
  return el
}

/**
 * Initial state
 */
const InitialState: AppState = {
  todo: [],
  done: [],
}

/**
 * App reducer
 */
const AppReducer = (state = InitialState, action: Action): AppState => {
  const { type, payload } = action
  switch (type) {
    /**
     * Add task
     */
    case ADD_TASK: {
      const tasks = [...state.todo, payload]
      return updateObj(state, { todo: tasks })
    }

    /**
     * Remove task
     */
    case REMOVE_TASK: {
      const todos = [...state.todo]
      const tasks = removeFromArray(todos, "id", payload)

      return updateObj(state, { todo: tasks })
    }

    /**
     * Finish task
     */
    case FINISH_TASK: {
      const { id } = payload
      let todo = [...state.todo]
      const done = [...state.done]

      // Update todo tasks
      todo = removeFromArray(todo, "id", id)

      // Update done tasks
      done.unshift(payload)

      // Update state
      return updateObj(state, { todo, done })
    }

    default:
      return state
  }
}

export default AppReducer
