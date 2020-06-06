import React from "react"
import { Task as TaskObject } from "@types"

type Props = {
  data: TaskObject
  done?: boolean
}

const Task: React.FC<Props> = ({ data, done }) => (
  <li className={done ? "is-done" : ""}>
    <h3>{data.title}</h3>
    <p>{data.description}</p>
    <button type="button" className="delete_button">
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
      <button type="button" className="done-button">
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

export default Task
