import 'preact/devtools'
import { render, h } from 'preact'
import {
  MODE,
  PUBLIC_URL,
  VERSION,
  COMMIT_HASH,
  REPOSITORY_URL
} from '@scripts/env'
import { App } from './App'

if ('serviceWorker' in navigator && MODE === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${PUBLIC_URL || '/'}service-worker.js`)
      .then(reg => console.log(`Registered Service Worker: ${reg.scope}`))
      .catch(err => console.error(err))
  })
}

async function main() {
  console.log(`v${VERSION}-${COMMIT_HASH.slice(0, 7)}`)
  console.log(`bug report: ${REPOSITORY_URL}/issues`)

  const root = document.querySelector('#root')
  if (root) render(<App />, root)
}

window.onload = main

// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) import.meta.hot.accept()
