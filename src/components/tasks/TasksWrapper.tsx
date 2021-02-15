import React from 'react'
import TodoList from './TodoList'
import DoneList from './DoneList'
import '../../assets/styles/components/Tasks.scss'

const TasksWrapper: React.FC = () => (
  <div className="tasks__list">
    <TodoList />
    <DoneList />
  </div>
)

export default TasksWrapper
