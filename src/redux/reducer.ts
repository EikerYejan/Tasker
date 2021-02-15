import { Action, AppState } from '@types'
import { updateObj, removeFromArray, editTasksArray } from '../utils/Utils'
import {
  ADD_TASK,
  REMOVE_TASK,
  FINISH_TASK,
  LAUNCH_APP,
  CHANGE_THEME,
  EDIT_TASK,
  RESTORE_TASK,
  DRAG_TASK,
} from './constants'

/**
 * Initial state
 */
const InitialState: AppState = {
  isRegistered: false,
  username: 'Stranger',
  theme: 'dark',
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
     * Launch app
     */
    case LAUNCH_APP: {
      const { isRegistered } = payload

      if (isRegistered) {
        return updateObj(state, payload)
      }

      return state
    }

    /**
     * Change UI theme
     */
    case CHANGE_THEME: {
      const { theme } = payload

      return updateObj(state, { theme })
    }

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
      const { id, done } = payload
      const index = done ? 'done' : 'todo'
      const items = [...state[index]]
      const tasks = removeFromArray(items, 'id', id)

      return updateObj(state, { [index]: tasks })
    }

    /**
     * Finish task
     */
    case FINISH_TASK: {
      const { id } = payload
      let todo = [...state.todo]
      const done = [...state.done]

      // Update todo tasks
      todo = removeFromArray(todo, 'id', id)

      // Update done tasks
      done.unshift(payload)

      // Update state
      return updateObj(state, { todo, done })
    }

    /**
     * Edit task
     */
    case EDIT_TASK: {
      const currentTasks = [...state.todo]
      const updatedTasks = editTasksArray(
        currentTasks,
        'id',
        payload.id,
        payload
      )

      return updateObj(state, { todo: updatedTasks })
    }

    /**
     * Restore task
     */
    case RESTORE_TASK: {
      const todo = [...state.todo]
      const done = [...state.done]

      // Update arrays
      todo.push(payload)
      const updatedDone = removeFromArray(done, 'id', payload.id)

      // Update state
      return updateObj(state, { todo, done: updatedDone })
    }

    /**
     * Drag tasks
     */
    case DRAG_TASK: {
      return updateObj(state, { todo: payload })
    }

    default:
      return state
  }
}

export default AppReducer
