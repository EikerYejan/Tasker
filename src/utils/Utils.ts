import { Task, Obj, ValueOf } from "@types"

/**
 * Generate ID
 */
const genID = (): number => Math.floor(Math.random() * 1000) + 1

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
 * Edit task
 */
const editTasksArray = (
  array: Task[],
  search: keyof Task,
  id: ValueOf<Task>,
  newElement: Task
): Task[] => {
  const newArray = [...array]

  for (let i = 0; i < newArray.length; i += 1) {
    const item = array[i]

    if (item[search] === id) newArray.splice(i, 1, newElement)
  }

  return newArray
}

export { genID, updateObj, removeFromArray, editTasksArray }
