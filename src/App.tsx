import React, {
  useState,
  useEffect
} from 'react'

import { CommandPalette } from '@components/CommandPalette'
import { HomePage } from '@pages/Home'
import { SettingsPage } from '@pages/Settings'

import { ISourceSet, ICollectionSet } from '@models/dataset'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { extractQuerySource, loadSourceSet } from '@scripts/source'
import { mergeCollection } from '@scripts/collection'
import { hash, hashToString } from '@scripts/hash'

import './app.scss'

let sourceSetList: ISourceSet[] = []
let collectionSetList: ICollectionSet[] = []

async function initURLSourceList(): Promise<string[]> {
  const sourceSet = extractQuerySource(window.location.search)
    .reduce((acc, cur) => acc.add(cur), new Set<string>())
  await getLocalSourceList().then(list =>
    list.forEach(value => sourceSet.add(value))
  )
  const list = Array.from(sourceSet)
  await saveLocalSourceList(list)
  return list
}

export const App: React.FC = () => {
  const [isComHidden, setIsComHidden] = useState(true)
  const [isLoading, setIsLoading]     = useState(true)
  const [collectionList, setCollectionList] = useState(collectionSetList)

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
    setIsLoading(true)
    try {
      const urls        = await initURLSourceList()
      sourceSetList     = await loadSourceSet(urls)
      collectionSetList = mergeCollection(sourceSetList)

      console.dir(collectionSetList)
      console.log('?source=' + urls.reduce((acc, cur) => `${acc}${acc && '+'}${cur}`, ''))

      setCollectionList(collectionSetList)
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    init()
    window.addEventListener('keypress', onKeyPress)
    return () =>
      window.removeEventListener('keypress', onKeyPress)
  }, [])

  return (
    <div className="app">
      <HomePage
        isActive={false}
        isLoading={isLoading}
        collections={collectionList}
      />
      {/* <SettingsPage /> */}
      <CommandPalette isHidden={isComHidden} isLoading={isLoading} />
    </div>
  )
}
