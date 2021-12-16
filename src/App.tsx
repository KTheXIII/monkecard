import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react'
import './app.css'

import {
  ChevronRight,
  FileEarmarkCodeFill,
} from '@assets/BootstrapIcons'
import { CommandPalette, CommandPaletteRef } from '@components/CommandPalette'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import { HomePage, HomePageRef } from '@pages/HomePage'
import { SettingsPage, SettingsPageRef } from '@pages/SettingsPage'
import { StudyPage, StudyPageRef } from '@pages/StudyPage'

import { ICollectionSet } from '@models/dataset'
import { ICommandBase } from '@models/command'
import { GetPlatform } from '@scripts/env'
import { Monke } from '@scripts/monke'
import {
  emptySession,
  createSession
} from '@models/study'

enum Page {
  Home,
  Settings,
  Study,
}

export const App: React.FC = () => {
  const [isComHidden, setIsComHidden] = useState(true)
  const [isLoading,   setIsLoading]   = useState(true)
  const [isNavHidden, setIsNavHidden] = useState(true)
  const [page, setPage]               = useState(Page.Home)
  const [session, setSession]         = useState(emptySession())
  const [commandList, setCommandList] = useState<ICommandBase[]>([])
  const [colleciontSet, setColleciontSet] = useState<ICollectionSet[]>([])

  const homeRef     = useRef<HomePageRef>(null)
  const settingsRef = useRef<SettingsPageRef>(null)
  const studyRef    = useRef<StudyPageRef>(null)
  const commandRef  = useRef<CommandPaletteRef>(null)
  const monke = useMemo(() =>  new Monke(), [])

  useEffect(() => {
    setIsLoading(true)
    monke.init().then(_ => {
      setColleciontSet(monke.collectionSet)
      monke.addCommandN('home', () => setPage(Page.Home))
      monke.addCommandN('settings', () => setPage(Page.Settings))
      monke.addCommandN('reload', () => monke.load()
        .then(_ => setColleciontSet(monke.collectionSet)))
      monke.addCommandI('add source', 'enter source url',
        (input) => monke.addSource(input)
          .then(_ => setColleciontSet(monke.collectionSet)))
      monke.addCommandO('remove source', 'select source to remove (up/down keys)',
        monke.getUrls.bind(monke),
        (src) => monke.removeSource(src)
          .then(_ => setColleciontSet(monke.collectionSet)))
      monke.addInternalCommands()
      setCommandList(monke.commands)
      setIsLoading(false)
    })
  }, [monke])

  const onReload = useCallback(() => {
    setIsLoading(true)
    monke.load().then(_ => {
      setColleciontSet(monke.collectionSet)
      setIsLoading(false)
    })
  }, [monke])

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
    if (e.code === 'KeyK' && e.metaKey) {
      setIsComHidden(!isComHidden)
      e.preventDefault()
      return
    }
    // Hide Command Palette
    if (e.key === 'Escape' && !isComHidden) {
      setIsComHidden(true)
      e.preventDefault()
      return
    }

    commandRef.current?.onKeyDown(e)
    if (!isComHidden) return
    studyRef.current?.onKeyDown(e)
  }, [isComHidden, studyRef])

  const onClick = useCallback((e: MouseEvent) => {
    if (!isComHidden && e.target === commandRef.current?.target) {
      setIsComHidden(true)
      e.preventDefault()
      e.stopImmediatePropagation()
      return
    }
  }, [isComHidden, commandRef])

  useEffect(() => {
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
        collections={colleciontSet}
        onStart={(type, items) => {
          setPage(Page.Study)
          setSession(createSession(type, items))
        }}
        onReload={onReload} />}
      {page === Page.Settings &&
      <SettingsPage
        ref={settingsRef}
        collections={colleciontSet}
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
          text="cmd"
          icon={ChevronRight}
          onClick={() => {
            setIsComHidden(false)
          }} />
      </ToolsFloat>
      <CommandPalette
        ref={commandRef}
        isHidden={isComHidden}
        commands={commandList}
        onHide={() => {
          setIsComHidden(true)
        }}
        isLoading={isLoading} />
    </div>
  )
}
