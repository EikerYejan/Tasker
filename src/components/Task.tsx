import React from "react"
import { connect } from "react-redux"
import { Task as TaskObject, Connected } from "@types"
import { deleteTask, finishTask } from "../redux/actions"

type DispatchProps = {
  deleteOne: ({ id, done }: { id: number; done: boolean }) => void
  finish: (task: TaskObject) => void
}

type OwnProps = {
  data: TaskObject
  done?: boolean
}

type Props = DispatchProps & OwnProps

const Task: React.FC<Props> = ({ data, done, deleteOne, finish }) => {
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

  return (
    <li className={done ? "is-done" : ""}>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
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
      {done ?? (
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
      )}
    </li>
  )
}

const connected: Connected<OwnProps> = connect(null, {
  deleteOne: deleteTask,
  finish: finishTask,
})(Task)

export default connected
