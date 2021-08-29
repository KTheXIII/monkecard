import { h, FunctionComponent as Func } from 'preact'
import { useEffect } from 'preact/hooks'

import { extractSource } from '@scripts/source'

export const App: Func = () => {
  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === '/') {
      console.log('/ pressed')
      e.preventDefault()
    }
  }

  useEffect(() => {
    console.log(window.location.search)
    console.log(extractSource(window.location.search))

    window.addEventListener('keypress', onKeyPress)
    return () => {
      window.removeEventListener('keypress', onKeyPress)
    }
  }, [])

  return (
    <div class='app'>
      <div className='test'>
        <h1>Hello, World!</h1>
      </div>
    </div>
  )
}
