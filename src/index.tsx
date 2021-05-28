import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'

import './style/index.scss'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((import.meta as any).hot) (import.meta as any).hot.accept()
