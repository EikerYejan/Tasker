import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"
import { saveAppData } from "../utils/Storage"
import AppReducer from "./reducer"

/**
 * Store
 */
const store = createStore(AppReducer, applyMiddleware(thunk, createLogger()))

/**
 * Save changes
 */
store.subscribe(() => saveAppData(store.getState()))

export default store
