import { Action, AppState, Obj, ValueOf } from "@types"
import { ADD_TASK, REMOVE_TASK } from "./actions"

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
      const tasks = removeFromArray(state.todo, "id", payload)
      console.log(tasks)

      return updateObj(state, { todo: tasks })
    }

    default:
      return state
  }
}

export default AppReducer
