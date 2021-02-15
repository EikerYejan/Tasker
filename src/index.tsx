import React from 'react'
import ReactDOM from 'react-dom'
import WebFont from 'webfontloader'
import { Provider } from 'react-redux'
import store from './redux/store'
import Wrapper from './components/Wrapper'
import * as serviceWorker from './serviceWorker'

/**
 * Load fonts
 */
WebFont.load({
  google: {
    families: ['Poppins:400,500'],
  },
  custom: {
    families: ['Gilroy'],
  },
})

/**
 * Render
 */
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Wrapper />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
