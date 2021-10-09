import React, { useState, useEffect } from 'react'
import { CommandPalette } from '@components/CommandPalette'
import { HomePage } from '@pages/Home'
import { SettingsPage } from '@pages/Settings'

import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { extractQuerySource, fetchCollectionSource } from '@scripts/source'
import { ISourceSet, ICollectionSet } from '@models/dataset'

import './app.scss'
import { mergeCollection } from '@scripts/collection'

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

async function fetchSourceSets(urls: string[]): Promise<ISourceSet[]> {
  return Promise.all(urls.map(async (url) => {
    const set: ISourceSet = { source: url, data: null }
    try {
      set.data = await fetchCollectionSource(url)
    } catch (err) {
      console.error(err)
    }
    return set
  }))
}

export const App: React.FC = () => {
  const [isComHidden, setIsComHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

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
      const urls = await initURLSourceList()
      sourceSetList = await fetchSourceSets(urls)
      collectionSetList = mergeCollection(sourceSetList)
      console.dir(sourceSetList)
      console.dir(collectionSetList)
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
      <HomePage isLoading={isLoading} />
      {/* <SettingsPage /> */}
      <CommandPalette isHidden={isComHidden} isLoading={isLoading} />
    </div>
  )
}
