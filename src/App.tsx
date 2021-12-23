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
import { HomePage } from '@pages/HomePage'
import { SettingsPage, SettingsPageRef } from '@pages/SettingsPage'
import { StudyPage, StudyPageRef } from '@pages/StudyPage'
import {
  ECommandType,
  ICommandBase,
  ICommandInput,
  ICommandNormal,
  ICommandOption
} from '@models/command'
import { GetPlatform, REPOSITORY_URL } from '@scripts/env'
import { Monke } from '@scripts/monke'
import { UserMonke } from '@scripts/user'
import { CollectionPage } from '@pages/CollectionPage'

enum Page {
  Home,
  Settings,
  Collection,
  Study,
}

export const App: React.FC = () => {
  const [isComHidden, setIsComHidden] = useState(true)
  const [isLoading,   setIsLoading]   = useState(true)
  const [isNavHidden, setIsNavHidden] = useState(true)
  const [page, setPage]               = useState(Page.Home)
  const [commandList, setCommandList] = useState<ICommandBase[]>([])

  const settingsRef = useRef<SettingsPageRef>(null)
  const studyRef    = useRef<StudyPageRef>(null)
  const commandRef  = useRef<CommandPaletteRef>(null)

  const monke = useMemo(() => new Monke(), [])
  const user  = useMemo(() => new UserMonke(), [])

  useEffect(() => {
    user.subjectSession.subscribe(s => {
      setPage(Page.Study)
    })
    user.init()
    monke.subjectIsLoading.subscribe(setIsLoading)
    monke.subjectCommands.subscribe(setCommandList)
    monke.subjectCollection.subscribe(c => {
      setPage(Page.Collection)
    })
    monke.init()

    monke.addCommand({
      type: ECommandType.Normal,
      name: 'home',
      fn: () => {
        setPage(Page.Home)
      },
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
    monke.addCommand({
      type: ECommandType.Option,
      name: 'collections',
      hint: 'select collection to go to',
      list: () => monke.getCollections().map(c => c.collection.title),
      fn: (option, i) => {
        monke.subjectCollection.next(i)
      },
    } as ICommandOption)
    monke.addCommand({
      type: ECommandType.Input,
      name: 'edit username',
      default: () => user.getUser().name,
      hint: 'enter source url',
      fn: input => {
        const u = user.getUser()
        u.name = input
        user.subjectUser.next(u)
      },
    } as ICommandInput)
    monke.addCommand({
      type: ECommandType.Normal,
      name: 'repository',
      fn: () => window.open(REPOSITORY_URL, '_blank'),
    } as ICommandNormal)
    monke.addCommand({
      type: ECommandType.Normal,
      name: 'report bugs',
      fn: () => window.open(`${REPOSITORY_URL}/issues`, '_blank'),
    } as ICommandNormal)
    monke.addCommand({
      type: ECommandType.Normal,
      name: 'docs',
      fn: () => window.open(`${REPOSITORY_URL}/tree/trunk/docs`, '_blank'),
    } as ICommandNormal)
  }, [monke, user])

  const onReload = useCallback(() => {
    monke.load(monke.getSources())
  }, [monke])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
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
    <div className="app md:w-[600px] md:mx-auto">
      {page === Page.Home       &&
      <HomePage
        isLoading={isLoading}
        monke={monke}
        user={user}
      />}
      {page === Page.Settings   &&
      <SettingsPage
        ref={settingsRef}
        monke={monke}
        onReload={onReload}
      />}
      {page === Page.Study      &&
      <StudyPage
        ref={studyRef}
        onHome={() => {
          setPage(Page.Home)
        }}
        user={user}
      />}
      {page === Page.Collection &&
      <CollectionPage
        monke={monke}
        user={user}
        isLoading={isLoading}
      />}

      <ToolsFloat isHidden={isNavHidden}>
        <ToolsFloatButton
          text="home"
          icon={FileEarmarkCodeFill}
          onClick={() => {
            setPage(Page.Home)
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
