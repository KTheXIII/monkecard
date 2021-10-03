import {
  h,
  FunctionComponent as Func
} from 'preact'
import {
  useState,
  useEffect,
} from 'preact/hooks'

import { CommandPalette } from '@components/CommandPalette'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { extractQuerySource, } from '@scripts/source'
import {} from '@scripts/user'
import './app.scss'

let sourceList: string[] = []

async function initSourceList(): Promise<string[]> {
  const sourceSet = extractQuerySource(window.location.search)
    .reduce((acc, cur) => acc.add(cur), new Set<string>())
  await getLocalSourceList().then(list =>
    list.forEach(value => sourceSet.add(value))
  )
  const list = Array.from(sourceSet)
  await saveLocalSourceList(list)
  return list
}

export const App: Func = () => {
  const [isComHidden, setIsComHidden] = useState(true)
  const [isLoading, setIsLoading]     = useState(true)

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === '/') {
      console.log('/ pressed')
      e.preventDefault()
    }
    // Show Command Palette
    if (e.key === 'p' && e.metaKey && e.shiftKey) {
      setIsComHidden(false)
      e.preventDefault()
    }
    // Hide Command Palette
    if (e.key === 'Escape') {
      setIsComHidden(true)
      e.preventDefault()
    }
  }

  async function init() {
    try {
      sourceList = await initSourceList()
      console.log(sourceList)

      // collectionList = []
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
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
      <CommandPalette isHidden={isComHidden} isLoading={isLoading} />
    </div>
  )
}
