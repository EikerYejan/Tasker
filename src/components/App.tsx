import React from "react"
import Header from "./Header"
import Welcome from "./Welcome"
import "../assets/styles/App.scss"

const Form = React.lazy(() => import("./Form"))

function App(): JSX.Element {
  return (
    <div id="app">
      <Header />
      <main>
        <React.Suspense fallback={<span className="app-loader loader" />}>
          <Welcome />
          <div className="columns is-multiline app__content">
            <Form />
            <div className="column is-7">List</div>
          </div>
        </React.Suspense>
      </main>
    </div>
  )
}

export default App
