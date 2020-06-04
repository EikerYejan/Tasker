import React from "react"
import Header from "./Header"
import "../assets/styles/App.scss"

function App(): JSX.Element {
  return (
    <div id="app">
      <Header />
      <main className="content">
        <span className="app-loader loader" />
      </main>
    </div>
  )
}

export default App
