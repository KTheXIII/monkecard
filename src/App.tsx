import {
  h,
  FunctionComponent as Func
} from 'preact'
import { useEffect } from 'preact/hooks'

import { extractSource } from '@scripts/source'

import './app.scss'

export const App: Func = () => {
  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === '/') {
      console.log('/ pressed')
      e.preventDefault()
    }
    if (e.key === 'p' && e.metaKey && e.shiftKey) {
      console.log('meta+shift+p pressed')
      e.preventDefault()
    }
  }

  useEffect(() => {
    console.log(`seach: ${window.location.search}`)
    console.log(extractSource(window.location.search))

    window.addEventListener('keypress', onKeyPress)
    return () => {
      window.removeEventListener('keypress', onKeyPress)
    }
  }, [])

  return (
    <div class='app'>
      <div className='test'>
        <span>Hello, World!</span>
      </div>
    </div>
  )
}
