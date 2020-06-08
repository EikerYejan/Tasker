import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"
import AppReducer from "./reducer"

/**
 * Store
 */
const store = createStore(AppReducer, applyMiddleware(thunk, createLogger()))

export default store
