import { Action, AppState, Obj } from "@types"

/**
 * Update object
 */
const updateObj = <T extends Obj>(oldObj: T, newObj: Obj): T => ({
  ...oldObj,
  ...newObj,
})

/**
 * Initial state
 */
const InitialState: AppState = {
  theme: "dark",
}

/**
 * App reducer
 */
const AppReducer = (state = InitialState, action: Action): AppState => {
  const { type, payload } = action
  switch (type) {
    default:
      return state
  }
}

export default AppReducer
