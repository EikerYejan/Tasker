import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import Header from "./Header"
import Welcome from "./Welcome"
import Tasks from "./Tasks"
import { saveItem, getItem } from "../utils/Storage"
import "../assets/styles/App.scss"

const Form = React.lazy(() => import("./Form"))

/* Localstorage theme ref */
const THEME_REF = "tasker_theme"

const App: React.FC = () => {
  /* Get localstorage item */
  const initialTheme = getItem(THEME_REF) ?? "dark"

  /* State */
  const [theme, setTheme] = useState<string>(initialTheme)

  /* Change theme */
  const changeTheme = () => {
    if (theme === "light") {
      setTheme("dark")
      saveItem(THEME_REF, "dark")
    } else {
      setTheme("light")
      saveItem(THEME_REF, "light")
    }
  }

  /* Update UI */
  useEffect(() => {
    const classes = ["theme-dark", "theme-light"]
    document.body.classList.remove(...classes)
    document.body.classList.add(`theme-${theme}`)
  }, [theme])

  return (
    <div id="app">
      <Helmet>
        <meta
          name="theme-color"
          content={theme === "dark" ? "#000000" : "#ffffff"}
        />
      </Helmet>
      <Header theme={theme} changeUI={changeTheme} />
      <main>
        <React.Suspense fallback={<span className="app-loader loader" />}>
          <Welcome />
          <div className="columns is-multiline app__content">
            <Form />
            <div className="column is-7">
              <Tasks />
            </div>
          </div>
        </React.Suspense>
      </main>
    </div>
  )
}

export default App
