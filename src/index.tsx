import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import {
  MODE,
  PUBLIC_URL,
  VERSION,
  COMMIT_HASH,
  REPOSITORY_URL,
  SPONSOR_URL,
  APP_NAME,
} from '@scripts/env'

if ('serviceWorker' in navigator && MODE === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${PUBLIC_URL || '/'}service-worker.js`)
      .then(reg => console.log(`Registered Service Worker: ${reg.scope}`))
      .catch(err => console.error(err))
  })
}

async function main() {
  console.log(`${APP_NAME} - v${VERSION}-${COMMIT_HASH.slice(0, 7)}`)
  console.log(`bug report: ${REPOSITORY_URL}/issues`)
  console.log(`sponsor me on github: ${SPONSOR_URL}`)

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.querySelector('#root')
  )
}

window.onload = main

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) import.meta.hot.accept()
