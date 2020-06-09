import React, { useState } from "react"
import { connect } from "react-redux"
import { Task as TaskObject, Connected } from "@types"
import { deleteTask, finishTask, editTask, restoreTask } from "../redux/actions"

type Func = (task: TaskObject) => void

type DispatchProps = {
  deleteOne: ({ id, done }: { id: number; done: boolean }) => void
  finish: Func
  edit: Func
  restore: Func
}

type OwnProps = {
  data: TaskObject
  done: boolean
}

type Props = DispatchProps & OwnProps

const Task: React.FC<Props> = ({
  data,
  done,
  deleteOne,
  finish,
  edit,
  restore,
}) => {
  /* State */
  const [isEditing, setEditing] = useState<boolean>(false)
  const [editData, setEditedData] = useState<TaskObject>(data)

  /**
   * Delete task
   */
  const handleDelete = (): void => {
    const shouldDelete = !done
      ? confirm("Are you sure you want to delete this task?") // eslint-disable-line
      : true

    if (shouldDelete) deleteOne({ id: data.id, done: done ?? false })
  }

  /**
   * Finish task
   */
  const handleFinish = (): void => finish(data)

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget

    setEditedData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <li className={done ? "is-done" : ""}>
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
            placeholder={data.description ?? "Description"}
          />
        </>
      ) : (
        <>
          <h3>{data.title}</h3>
          <p>{data.description}</p>
        </>
      )}

      <button onClick={handleDelete} type="button" className="delete_button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 512 512"
        >
          <line
            x1="368"
            y1="368"
            x2="144"
            y2="144"
            style={{
              fill: "none",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "32px",
            }}
          />
          <line
            x1="368"
            y1="144"
            x2="144"
            y2="368"
            style={{
              fill: "none",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "32px",
            }}
          />
        </svg>
      </button>
      {!done ? (
        <>
          <button onClick={handleEdit} type="button" className="edit-button">
            {isEditing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="512"
                height="512"
                viewBox="0 0 512 512"
              >
                <path
                  d="M380.93,57.37A32,32,0,0,0,358.3,48H94.22A46.21,46.21,0,0,0,48,94.22V417.78A46.21,46.21,0,0,0,94.22,464H417.78A46.36,46.36,0,0,0,464,417.78V153.7a32,32,0,0,0-9.37-22.63ZM256,416a64,64,0,1,1,64-64A63.92,63.92,0,0,1,256,416Zm48-224H112a16,16,0,0,1-16-16V112a16,16,0,0,1,16-16H304a16,16,0,0,1,16,16v64A16,16,0,0,1,304,192Z"
                  style={{
                    fill: "none",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "32px",
                  }}
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="512"
                height="512"
                viewBox="0 0 512 512"
              >
                <path
                  d="M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48"
                  style={{
                    fill: "none",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "32px",
                  }}
                />
                <path d="M459.94,53.25a16.06,16.06,0,0,0-23.22-.56L424.35,65a8,8,0,0,0,0,11.31l11.34,11.32a8,8,0,0,0,11.34,0l12.06-12C465.19,69.54,465.76,59.62,459.94,53.25Z" />
                <path d="M399.34,90,218.82,270.2a9,9,0,0,0-2.31,3.93L208.16,299a3.91,3.91,0,0,0,4.86,4.86l24.85-8.35a9,9,0,0,0,3.93-2.31L422,112.66A9,9,0,0,0,422,100L412.05,90A9,9,0,0,0,399.34,90Z" />
              </svg>
            )}
          </button>
          <button onClick={handleFinish} type="button" className="done-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 512 512"
            >
              <polyline
                points="416 128 192 384 96 288"
                style={{
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
              />
            </svg>
          </button>
        </>
      ) : (
        <button
          onClick={() => restore(data)}
          type="button"
          className="restore-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
          >
            <path
              d="M434.67,285.59v-29.8C434.67,157.06,354.43,77,255.47,77a179,179,0,0,0-140.14,67.36m-38.53,82v29.8C76.8,355,157,435,256,435a180.45,180.45,0,0,0,140-66.92"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "32px",
              }}
            />
            <polyline
              points="32 256 76 212 122 256"
              style={{
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "32px",
              }}
            />
            <polyline
              points="480 256 436 300 390 256"
              style={{
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "32px",
              }}
            />
          </svg>
        </button>
      )}
    </li>
  )
}

const connected: Connected<OwnProps> = connect(null, {
  deleteOne: deleteTask,
  finish: finishTask,
  edit: editTask,
  restore: restoreTask,
})(Task)

export default connected
