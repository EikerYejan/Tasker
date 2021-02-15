import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { Task as TaskObject, Connected } from '@types'
import useDrag from './hooks/useDrag'
import useTask, { Func, DeleteFunc } from './hooks/useTask'
import { FinishIcon, EditIcon, SaveIcon, DeleteIcon } from './Icons'
import { deleteTask, finishTask, editTask } from '../../redux/actions'

type DispatchProps = {
  deleteOne: DeleteFunc
  finish: Func
  edit: Func
}

type OwnProps = {
  data: TaskObject
  index: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
}

type Props = DispatchProps & OwnProps

const Task: React.FC<Props> = ({
  data,
  index,
  deleteOne,
  finish,
  edit,
  moveItem,
}) => {
  /* Task hook  */
  const { handleDelete, handleEdit, handleChange, isEditing } = useTask({
    data,
    deleteOne,
    edit,
  })

  /* Container ref */
  const ref = useRef<HTMLLIElement>(null)

  /**
   * Drag and drop hook
   */
  const [drag, drop, isDragging] = useDrag({
    ref,
    index,
    moveItem,
    id: data.id,
  })

  /**
   * Allow dragging
   */
  drag(drop(ref))

  return (
    <li className={isDragging ? 'is-dragging' : 'is-static'} ref={ref}>
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
        onClick={handleDelete}
        type="button"
        className="delete_button"
        title="Delete task"
      >
        {DeleteIcon}
      </button>
      <button
        onClick={handleEdit}
        type="button"
        className="edit-button"
        title="Edit task"
      >
        {isEditing ? SaveIcon : EditIcon}
      </button>
      <button
        onClick={() => finish(data)}
        type="button"
        className="done-button"
        title="Finish task"
        style={{
          opacity: isEditing ? 0 : 1,
        }}
      >
        {FinishIcon}
      </button>
    </li>
  )
}

const connected: Connected<OwnProps> = connect(null, {
  deleteOne: deleteTask,
  finish: finishTask,
  edit: editTask,
})(Task)

export default connected
