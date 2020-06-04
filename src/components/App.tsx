import React from "react"
import Header from "./Header"
import Welcome from "./Welcome"
import "../assets/styles/App.scss"

function App(): JSX.Element {
  return (
    <div id="app">
      <Header />
      <main className="app__content">
        <Welcome />
        {/* <span className="app-loader loader" /> */}
      </main>
    </div>
  )
}

export default App
