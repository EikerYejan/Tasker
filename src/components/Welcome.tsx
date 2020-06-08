import React from "react"
import { connect } from "react-redux"
import { Connected, StateToProps } from "@types"
import "../assets/styles/components/Welcome.scss"

type Props = {
  name: string
}

const Welcome: React.FC<Props> = ({ name }) => (
  <div className="column is-12 welcome">
    <div className="welcome__content">
      <h1>{`Hello ${name}`}</h1>
      <p>Welcome to Tasker, here you can manage your tasks and to-do items</p>
    </div>
  </div>
)

const mapStateToProps: StateToProps<Props> = (state) => ({
  name: state.username,
})

const connected: Connected = connect(mapStateToProps)(Welcome)

export default connected
