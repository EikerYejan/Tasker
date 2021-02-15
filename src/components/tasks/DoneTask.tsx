import React from 'react'
import { connect } from 'react-redux'
import { Task as TaskObject, Connected } from '@types'
import useTask, { Func, DeleteFunc } from './hooks/useTask'
import { DeleteIcon, RestoreIcon } from './Icons'
import { deleteTask, editTask, restoreTask } from '../../redux/actions'

type DispatchProps = {
  deleteOne: DeleteFunc
  edit: Func
  restore: Func
}

type OwnProps = {
  data: TaskObject
}

type Props = DispatchProps & OwnProps

const Task: React.FC<Props> = ({ data, deleteOne, edit, restore }) => {
  /* Task hook  */
  const { handleChange, isEditing } = useTask({
    data,
    deleteOne,
    edit,
  })

  return (
    <li className="is-done">
      {isEditing ? (
        <>
          <input
            name="title"
            onChange={handleChange}
            type="text"
            placeholder={data.title}
          />
          <input
            onChange={handleChange}
            type="text"
            name="description"
            placeholder={data.description ?? 'Description'}
          />
        </>
      ) : (
        <>
          <h3>{data.title}</h3>
          <p>{data.description}</p>
        </>
      )}

      <button
        onClick={() => deleteOne({ id: data.id, done: true })}
        type="button"
        className="delete_button"
        title="Delete task"
      >
        {DeleteIcon}
      </button>
      <button
        onClick={() => restore(data)}
        type="button"
        className="restore-button"
        title="Not done yet?"
      >
        {RestoreIcon}
      </button>
    </li>
  )
}

const connected: Connected<OwnProps> = connect(null, {
  deleteOne: deleteTask,
  edit: editTask,
  restore: restoreTask,
})(Task)

export default connected
