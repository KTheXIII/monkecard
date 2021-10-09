import React, { useState, useEffect } from 'react'
import { CommandPalette } from '@components/CommandPalette'
import { CollectionList } from '@components/CollectionList'
import { HomePage } from '@pages/Home'
import { SettingsPage } from '@pages/Settings'

import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import {
  extractQuerySource,
  ICollectionSet
} from '@scripts/source'
import './app.scss'
import { ICollection } from '@scripts/collection'

const collectionSet = new Set<ICollectionSet>()
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

async function initCollectionSet(sources: string[],
  set: Set<ICollectionSet>): Promise<void> {
  return Promise.resolve()
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
    try {
      sourceList = await initSourceList()
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
    <div className="app">
      <HomePage isLoading={isLoading} />
      {/* <SettingsPage /> */}
      <CommandPalette isHidden={isComHidden} isLoading={isLoading} />
    </div>
  )
}
