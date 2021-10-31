import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import './app.css'

import { FileEarmarkCodeFill, MenuButtonWideFill } from '@assets/BootstrapIcons'
import { CommandPalette } from '@components/CommandPalette'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import { HomePage, HomePageRef } from '@pages/HomePage'
import { SettingsPage, SettingsPageRef } from '@pages/SettingsPage'
import { StudyPage } from '@pages/StudyPage'

import { ISourceSet, ICollectionSet } from '@models/dataset'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { mergeCollection } from '@scripts/collection'
import { extractQuerySource, loadSourceSet } from '@scripts/source'
import { EItemType, Item } from '@models/collection'
import {
  StudySession, emptySession, createSession
} from '@models/study'

enum Page {
  Home,
  Settings,
  Study,
}

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
  const [isLoading,   setIsLoading]   = useState(true)
  const [isNavHidden, setIsNavHidden] = useState(true)
  const [page, setPage]               = useState(Page.Home)
  const [setList, setSetList]         = useState(collectionSetList)
  const homeRef                       = useRef<HomePageRef>(null)
  const settingsRef                   = useRef<SettingsPageRef>(null)
  const [session, setSession] = useState(emptySession())

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

      setSetList(collectionSetList)
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  const onReload = useCallback(() => {
    init()
  }, [])

  useEffect(() => {
    init()
    window.addEventListener('keypress', onKeyPress)
    return () =>
      window.removeEventListener('keypress', onKeyPress)
  }, [])

  useEffect(() => {
    setIsNavHidden(page === Page.Study)
  }, [page])

  return (
    <div className="app">
      {page === Page.Home     &&
      <HomePage
        ref={homeRef}
        isLoading={isLoading}
        collections={setList}
        onStart={(type, items) => {
          setPage(Page.Study)
          setSession(createSession(type, items))
        }}
        onReload={onReload} />}
      {page === Page.Settings &&
      <SettingsPage
        ref={settingsRef}
        collections={setList}
        onReload={onReload}
      />}
      {page === Page.Study    &&
      <StudyPage onHome={() => {
        setPage(Page.Home)
      }} session={session} />}

      <ToolsFloat isHidden={isNavHidden}>
        <ToolsFloatButton
          text="home"
          icon={FileEarmarkCodeFill}
          onClick={() => {
            setPage(Page.Home)
            homeRef.current?.onActive()
          }} />
        <ToolsFloatButton
          text="more"
          icon={MenuButtonWideFill}
          onClick={() => {
            setPage(Page.Settings)
            settingsRef.current?.onActive()
          }} />
      </ToolsFloat>
      <CommandPalette isHidden={isComHidden} isLoading={isLoading} />
    </div>
  )
}
