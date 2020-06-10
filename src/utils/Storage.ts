import { AppState } from "@types"
import { APP_REF } from "../redux/constants"

/**
 * Save localstorage item
 * @param key
 * @param value
 */
const saveItem = (key: string, value: string): void =>
  window.localStorage.setItem(key, value)

/**
 * Get localstorage item
 * @param key
 * @param isJSON
 */
const getItem = (key: string): string | null => window.localStorage.getItem(key)

/**
 * Save app data
 * @param data
 */
const saveAppData = (data: AppState): void =>
  saveItem(APP_REF, JSON.stringify(data))

/**
 * Get app data
 */
const getAppData = (): AppState => JSON.parse(getItem(APP_REF) ?? "{}")

export { saveItem, getItem, saveAppData, getAppData }
