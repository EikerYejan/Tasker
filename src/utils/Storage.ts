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

export { saveItem, getItem }
