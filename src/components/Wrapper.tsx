import React, { useEffect, useState, useRef } from "react"
import { Helmet } from "react-helmet"
import { connect } from "react-redux"
import { Connected, StateToProps } from "@types"
import { launchApp } from "../redux/actions"
import Header from "./Header"
import App from "./App"
import "../assets/styles/App.scss"

type ConnectProps = {
  theme: string
}

type DispatchProps = {
  launch: () => void
}

type Props = ConnectProps & DispatchProps

const Wrapper: React.FC<Props> = ({ launch, theme }) => {
  /* State */
  const [isLoading, setLoading] = useState(true)

  /* Container ref */
  const container = useRef<HTMLDivElement>(null)

  /**
   * Fire up app
   */
  useEffect(() => {
    // Get app data
    launch()

    // Animate container
    container.current?.classList.add("is-changing")

    // Show content
    setTimeout(() => {
      container.current?.classList.remove("is-changing")
      setLoading(false)
    }, 800)
  }, [launch])

  /*
   * Update UI
   */
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
      <Header />
      <div ref={container} className="transition-wrapper">
        {isLoading ? <span className="app-loader loader" /> : <App />}
      </div>
    </div>
  )
}

const mapStateToProps: StateToProps<ConnectProps> = (state) => ({
  theme: state.theme,
})

const connected: Connected = connect(mapStateToProps, { launch: launchApp })(
  Wrapper
)

export default connected
