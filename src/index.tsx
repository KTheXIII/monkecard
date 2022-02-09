import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import {
  VERSION,
  COMMIT_HASH,
  REPOSITORY_URL,
  SPONSOR_URL,
  APP_NAME,
  BUILD_DATE,
  RegisterServiceWorker,
} from '@scripts/env'

async function main() {
  console.log(`${APP_NAME} - v${VERSION}-${COMMIT_HASH.slice(0, 7)}`)
  console.log(`build date: ${BUILD_DATE}`)
  console.log(`bug report: ${REPOSITORY_URL}/issues`)
  console.log(`sponsor me on github: ${SPONSOR_URL}`)

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.querySelector('#root')
  )
}

RegisterServiceWorker()
window.onload = main

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) import.meta.hot.accept()
