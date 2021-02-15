import React from 'react'
import { connect } from 'react-redux'
import { Task as TaskObject, StateToProps, Connected } from '@types'
import Task from './DoneTask'

type Props = {
  tasks: TaskObject[]
}

const DoneList: React.FC<Props> = ({ tasks }) => (
  <div className="done_wrapper">
    {tasks.length !== 0 ? (
      <>
        <h2>Done:</h2>
        <ul className="done">
          {tasks.map((task) => (
            <Task key={task.id} data={task} />
          ))}
        </ul>
      </>
    ) : null}
  </div>
)

const mapStateToProps: StateToProps<Props> = (state) => ({ tasks: state.done })

const connected: Connected = connect(mapStateToProps)(DoneList)

export default connected
