import React from 'react'
import { connect } from 'react-redux'
import { Connected, StateToProps } from '@types'
import { changeTheme } from '../redux/actions'
import dark from '../assets/images/dark.webp'
import light from '../assets/images/light.webp'
import '../assets/styles/components/UISwitch.scss'

type ConnectProps = {
  theme: string
}

type DispatchProps = {
  changeUI: (current: string) => void
}

type Props = ConnectProps & DispatchProps

const UISwitch: React.FC<Props> = ({ changeUI, theme }) => (
  <button
    onClick={() => changeUI(theme)}
    className={`theme-${theme}`}
    type="button"
    id="ui-switch"
  >
    <span className="switch__handle" />
    <img className="dark-icon" src={dark} alt="dark-mode" />
    <img className="light-icon" src={light} alt="light-mode" />
  </button>
)

const mapStateToProps: StateToProps<ConnectProps> = (state) => ({
  theme: state.theme,
})

const connected: Connected = connect(mapStateToProps, {
  changeUI: changeTheme,
})(UISwitch)

export default connected
