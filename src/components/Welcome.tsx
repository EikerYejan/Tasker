import React from "react"
import "../assets/styles/components/Welcome.scss"

const Welcome: React.FC = () => (
  <div className="column is-12 welcome">
    <div className="welcome__content">
      <h1>Hello Stranger</h1>
      <p>Welcome to Tasker, here you can manage your tasks and to-do items</p>
    </div>
  </div>
)

export default Welcome
