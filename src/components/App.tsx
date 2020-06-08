import React from "react"
import Welcome from "./Welcome"
import Tasks from "./Tasks"
import Form from "./Form"

const App: React.FC = () => (
  <main>
    <Welcome />
    <div className="columns is-multiline app__content">
      <Form />
      <div className="column is-7">
        <Tasks />
      </div>
    </div>
  </main>
)

export default App
