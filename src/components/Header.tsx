import React from "react"
import UISwitch from "./UISwitch"
import logo from "../assets/images/logo.svg"
import git from "../assets/images/github.webp"
import "../assets/styles/components/Header.scss"

const Header: React.FC = () => (
  <header className="header" role="banner">
    <div className="header__logo">
      <img src={logo} alt="tasker_logo" />
    </div>
    <div className="header__center">
      <div>
        <a
          href="https://github.com/EikerYejan/Markdown"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={git} alt="github" />
        </a>
      </div>
    </div>
    <div className="header__end">
      <UISwitch />
    </div>
  </header>
)

export default Header
