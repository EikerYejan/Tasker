import React from "react"
import { connect } from "react-redux"
import { Task as TaskObject, Connected, StateToProps } from "@types"
import TaskItem from "./Task"
import "../assets/styles/components/Tasks.scss"

type Props = {
  todo: TaskObject[]
  done: TaskObject[]
}

const Tasks: React.FC<Props> = ({ todo, done }) => (
  <div className="tasks__list">
    <h2>To do:</h2>
    <ul className="todo">
      {todo.map((task) => (
        <TaskItem key={task.id} data={task} done={false} />
      ))}
    </ul>
    {done.length !== 0 && (
      <>
        <h2>Done:</h2>
        <ul className="done">
          {done.map((el) => (
            <TaskItem key={el.title} data={el} done />
          ))}
        </ul>
      </>
    )}
  </div>
)

const mapStateToProps: StateToProps<Props> = (state) => ({
  todo: state.todo,
  done: state.done,
})

const connected: Connected = connect(mapStateToProps)(Tasks)

export default connected
