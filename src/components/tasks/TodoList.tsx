import React, { useCallback, useState } from "react"
import { connect } from "react-redux"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Task, StateToProps, Connected } from "@types"
import update from "immutability-helper"
import TaskItem from "./TodoTask"

type Props = {
  todo: Task[]
}

const TodoList: React.FC<Props> = ({ todo }) => {
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
   * Render tasks
   */
  const renderTask = (data: Task, index: number) => (
    <TaskItem data={data} key={data.id} index={index} moveItem={moveItem} />
  )

  return (
    <div className="todo-wrapper">
      <h2>To do:</h2>
      <DndProvider backend={HTML5Backend}>
        <ul className="todo">{tasks.map((task, i) => renderTask(task, i))}</ul>
      </DndProvider>
    </div>
  )
}

const mapStateToProps: StateToProps<Props> = (state) => ({
  todo: state.todo,
})

const connected: Connected = connect(mapStateToProps)(TodoList)

export default connected
