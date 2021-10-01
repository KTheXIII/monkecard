import {
  h,
  FunctionComponent as Func
} from 'preact'
import {
  useState,
  useEffect,
  useRef
} from 'preact/hooks'
import katex from 'katex'

import { CommandPalette } from '@components/CommandPalette'
import { extractSource, GetCollection } from '@scripts/source'
import { localSourceList } from '@scripts/cache'

import './app.scss'

export const App: Func = () => {
  const [isComHidden, setIsComHidden] = useState(true)
  const [isLoading, setIsLoading]     = useState(true)

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === '/') {
      console.log('/ pressed')
      e.preventDefault()
    }
    // Toggle Command Palette
    if (e.key === 'p' && e.metaKey && e.shiftKey) {
      setIsComHidden(prev => !prev)
      e.preventDefault()
    }
    // Hide Command Palette
    if (e.key === 'Escape') {
      setIsComHidden(true)
      e.preventDefault()
    }
  }

  async function init() {
    const localSourceList = await localSourceList()
  }

  useEffect(() => {
    init()
    window.addEventListener('keypress', onKeyPress)
    return () => {
      window.removeEventListener('keypress', onKeyPress)
    }
  }, [])

  return (
    <div class='app'>
      <CommandPalette isHidden={isComHidden} />
    </div>
  )
}
