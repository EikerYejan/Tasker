import { Action, AppState, Obj } from "@types"
import { ADD_TASK } from "./actions"

/**
 * Update object
 */
const updateObj = <T extends Obj>(oldObj: T, newObj: Partial<T>): T => ({
  ...oldObj,
  ...newObj,
})

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
      const newState = updateObj(state, { todo: tasks })
      return newState
    }

    default:
      return state
  }
}

export default AppReducer
