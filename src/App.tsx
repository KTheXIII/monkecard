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
import { IActivity } from '@models/user'
import {
  ECommandType, ICommandBase, ICommandInput, ICommandNormal, ICommandOption
} from '@models/command'
import { GetPlatform } from '@scripts/env'
import { Monke } from '@scripts/monke'
import {
  emptySession,
  createSession
} from '@models/study'
import { MemoHeatmap } from '@components/MemoHeatmap'

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
  const colors = useMemo(() => {
    const base = getComputedStyle(document.body)
      .getPropertyValue('--activity-min').trim()
    const max = getComputedStyle(document.body)
      .getPropertyValue('--blue').trim()
    const colorBase = parseInt(base.slice(1), 16)
    const colorMax = parseInt(max.slice(1), 16)

    return [colorBase, colorMax] as [number, number]
  }, [])
  const monke = useMemo(() =>  new Monke(), [])

  useEffect(() => {
    monke.subjectIsLoading.subscribe(setIsLoading)
    monke.subjectCollections.subscribe(setColleciontSet)
    monke.subjectCommands.subscribe(setCommandList)
    monke.init()

    monke.addCommand({
      type: ECommandType.Normal,
      name: 'home',
      fn: () => setPage(Page.Home),
    } as ICommandNormal)
    monke.addCommand({
      type: ECommandType.Normal,
      name: 'settings',
      fn: () => setPage(Page.Settings),
    } as ICommandNormal)
    monke.addCommand({
      type: ECommandType.Normal,
      name: 'reload',
      fn: () => monke.load(monke.getSources()),
    } as ICommandNormal)
    monke.addCommand({
      type: ECommandType.Input,
      name: 'add source',
      hint: 'enter source url',
      fn: input => monke.addSource(input),
    } as ICommandInput)
    monke.addCommand({
      type: ECommandType.Option,
      name: 'remove source',
      hint: 'select source to remove',
      list: monke.getSources.bind(monke),
      fn: option => monke.removeSource(option),
    } as ICommandOption)
    // monke.addCommand({
    //   type: ECommandType.Input,
    //   name: 'create collection',
    //   hint: 'enter collection name',
    //   fn: input => monke.createCollection(input),
    // } as ICommandInput)
  }, [monke])

  const onReload = useCallback(() => {
    monke.load(monke.getSources())
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

  const activites = useMemo(() => Array(365).fill(0).map((_, i) => {
    return Math.random() * (Math.random() > 0.2 ? 1 : 0)
  }).map((v, i) => ({
    active: v,
    count: Math.floor(v * 25),
    date: new Date(Date.now() - (i * 1000 * 60 * 60 * 24)),
  } as IActivity)).reverse(), [])

  return (
    <div className="app">
      <MemoHeatmap heats={activites} colors={colors} />
      {/* {page === Page.Home     &&
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
      />} */}

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
          onClick={() => setIsComHidden(false)} />
      </ToolsFloat>
      <CommandPalette
        ref={commandRef}
        isHidden={isComHidden}
        commands={commandList}
        onHide={() => setIsComHidden(true)}
        isLoading={isLoading} />
    </div>
  )
}
