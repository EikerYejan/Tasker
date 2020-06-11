import React from "react"
import Welcome from "./Welcome"
import TasksWrapper from "./tasks/TasksWrapper"
import Form from "./Form"

const App: React.FC = () => (
  <main>
    <Welcome />
    <div className="columns is-multiline app__content">
      <Form />
      <div className="column is-7">
        <TasksWrapper />
      </div>
    </div>
  </main>
)

export default App
