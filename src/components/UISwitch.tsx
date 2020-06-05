import React from "react"
import dark from "../assets/images/dark.webp"
import light from "../assets/images/light.webp"
import "../assets/styles/components/UISwitch.scss"

type Props = {
  changeUI: () => void
  theme: string
}

const UISwitch: React.FC<Props> = ({ changeUI, theme }) => (
  <button
    onClick={changeUI}
    className={`theme-${theme}`}
    type="button"
    id="ui-switch"
  >
    <span className="switch__handle" />
    <img className="dark-icon" src={dark} alt="dark-mode" />
    <img className="light-icon" src={light} alt="light-mode" />
  </button>
)

export default UISwitch
