import { createStore, applyMiddleware } from "redux"
import { createLogger } from "redux-logger"
import { Action } from "@types"

/**
 * Action types
 */
const CHANGE_THEME = "CHANGE_THEME"

/**
 * Initial state
 */
const InitialState = {
  theme: "dark",
}

/**
 * App reducer
 */
const AppReducer = (state = InitialState, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case CHANGE_THEME: {
      const newState = { ...state, theme: payload }
      return newState
    }

    default:
      return state
  }
}

/**
 * Store
 */
const store = createStore(AppReducer, applyMiddleware(createLogger()))

export default store
