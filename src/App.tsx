import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import './app.css'

import { FileEarmarkCodeFill, MenuButtonWideFill } from '@assets/BootstrapIcons'
import { CommandPalette, CommandPaletteRef } from '@components/CommandPalette'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import { HomePage, HomePageRef } from '@pages/HomePage'
import { SettingsPage, SettingsPageRef } from '@pages/SettingsPage'
import { StudyPage, StudyPageRef } from '@pages/StudyPage'

import { ISourceSet, ICollectionSet } from '@models/dataset'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { mergeCollection } from '@scripts/collection'
import { extractQuerySource, loadSourceSet } from '@scripts/source'
import { GetPlatform } from '@scripts/env'
import {
  emptySession,
  createSession
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
  const studyRef                      = useRef<StudyPageRef>(null)
  const commandRef                    = useRef<CommandPaletteRef>(null)
  const [session, setSession] = useState(emptySession())

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '/') {
      console.log('/ pressed')
      e.preventDefault()
    }
    // Show Command Palette
    if (e.code === 'KeyP' && e.metaKey && e.shiftKey &&
        GetPlatform() === 'macOS') {
      setIsComHidden(false)
      e.preventDefault()
      return
    }
    if (e.code === 'KeyP' && e.ctrlKey && e.shiftKey &&
        GetPlatform() === 'Windows') {
      setIsComHidden(false)
      e.preventDefault()
      return
    }
    // Hide Command Palette
    if (e.key === 'Escape' && !isComHidden) {
      setIsComHidden(true)
      e.preventDefault()
      return
    }

    if (!isComHidden) return
    studyRef.current?.onKeyDown(e)
  }, [isComHidden, studyRef])

  const onClick = useCallback((e: MouseEvent) => {
    if (!isComHidden && e.target !== commandRef.current?.target) {
      setIsComHidden(true)
      e.preventDefault()
      e.stopImmediatePropagation()
      return
    }
  }, [isComHidden, commandRef])

  async function init() {
    setIsLoading(true)
    try {
      const urls        = await initURLSourceList()
      sourceSetList     = await loadSourceSet(urls)
      collectionSetList = mergeCollection(sourceSetList)

      console.dir(collectionSetList)
      console.log('?source=' + urls.reduce((acc, cur) => `${acc}${acc && '+'}${cur}`, ''))

      setSetList(collectionSetList)

      // TODO: Might save the data in the indexeddb instead
      // const dbs = await indexedDB.databases()
      // dbs.forEach(db =>  db.name && indexedDB.deleteDatabase(db.name))
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
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('click', onClick)
    }
  }, [onKeyDown, onClick])

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
      <StudyPage
        ref={studyRef}
        onHome={() => {
          setPage(Page.Home)
        }} session={session}
      />}

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
      <CommandPalette
        ref={commandRef}
        isHidden={isComHidden}
        isLoading={isLoading} />
    </div>
  )
}
