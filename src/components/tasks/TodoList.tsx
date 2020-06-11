import React, { useCallback, useState, useEffect } from "react"
import { connect } from "react-redux"
import { DndProvider } from "react-dnd-multi-backend"
import HTML5ToTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch"
import { Task, StateToProps, Connected } from "@types"
import update from "immutability-helper"
import { updateDrag } from "../../redux/actions"
import TaskItem from "./TodoTask"

type DispatchProps = {
  updateTasks: (tasks: Task[]) => void
}

type ConnectedProps = {
  todo: Task[]
}

type Props = DispatchProps & ConnectedProps

const TodoList: React.FC<Props> = ({ todo, updateTasks }) => {
  /* State */
  const [tasks, setTasks] = useState(todo)

  /**
   * Move tasks
   */
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = tasks[dragIndex]
      setTasks(
        update(tasks, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      )
    },
    [tasks]
  )

  /**
   * Listen for dragging changes
   */
  useEffect(() => {
    updateTasks(tasks)
  }, [tasks, updateTasks])

  /**
   * Listen for state change
   */
  useEffect(() => {
    setTasks(todo)
  }, [todo])

  return (
    <div className="todo-wrapper">
      <h2>To do:</h2>
      <DndProvider options={HTML5ToTouch}>
        <ul className="todo">
          {tasks.map((task, i) => (
            <TaskItem
              key={task?.id}
              data={task}
              index={i}
              moveItem={moveItem}
            />
          ))}
        </ul>
      </DndProvider>
    </div>
  )
}

const mapStateToProps: StateToProps<ConnectedProps> = (state) => ({
  todo: state.todo,
})

const connected: Connected = connect(mapStateToProps, {
  updateTasks: updateDrag,
})(TodoList)

export default connected
