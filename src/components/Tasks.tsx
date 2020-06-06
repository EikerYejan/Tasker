import React from "react"
import { Task as TaskObject } from "@types"
import Task from "./Task"
import "../assets/styles/components/Tasks.scss"

const tasks: TaskObject[] = [
  {
    title: "Task 1",
    description: "Description 1",
  },
  {
    title: "Task 2",
    description: "Description 1",
  },
  {
    title: "Task 3",
    description: "Description 1",
  },
  {
    title: "Task 4",
    description: "Description 1",
  },
  {
    title: "Task 5",
    description: "Description 1",
  },
]

const done: TaskObject[] = [
  {
    title: "Done",
  },
  {
    title: "Done 2",
  },
  {
    title: "Done 3",
  },
]

const Tasks: React.FC = () => (
  <div className="tasks__list">
    <h2>To do:</h2>
    <ul className="todo">
      {tasks.map((task) => (
        <Task key={task.title} data={task} />
      ))}
    </ul>
    <h2>Done:</h2>
    <ul className="done">
      {done.map((el) => (
        <Task key={el.title} data={el} done />
      ))}
    </ul>
  </div>
)

export default Tasks
