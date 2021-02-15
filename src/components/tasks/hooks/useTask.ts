import { useState } from 'react'
import { Task as TaskObject } from '@types'

export type Func = (task: TaskObject) => void
export type DeleteFunc = ({ id, done }: { id: number; done: boolean }) => void
type HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => void
type VoidFunc = () => void

type Params = {
  data: TaskObject
  done?: boolean
  deleteOne: DeleteFunc
  edit: Func
}

type Return = {
  handleDelete: VoidFunc
  handleEdit: VoidFunc
  handleChange: HandleChange
  isEditing: boolean
}

type UseTasks = ({ ...args }: Params) => Return

const useTask: UseTasks = ({ data, done, deleteOne, edit }) => {
  /* State */
  const [isEditing, setEditing] = useState<boolean>(false)
  const [editData, setEditedData] = useState<TaskObject>(data)

  /**
   * Delete task
   */
  const handleDelete = (): void => {
    const shouldDelete = !done
      ? confirm('Are you sure you want to delete this task?') // eslint-disable-line
      : true

    if (shouldDelete) deleteOne({ id: data.id, done: done ?? false })
  }

  /**
   * Edit task
   */
  const handleEdit = (): void => {
    if (isEditing) {
      edit(editData)
      setEditing(false)
    } else {
      setEditing(true)
    }
  }

  /**
   * Handle edit task input change
   * @param e
   */
  const handleChange: HandleChange = (e) => {
    const { name, value } = e.currentTarget

    setEditedData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  /**
   * Return
   */
  return { handleDelete, handleEdit, handleChange, isEditing }
}

export default useTask
