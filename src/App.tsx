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
import {
  CommandPalette,
  CommandPaletteRef,
} from '@components/CommandPalette'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import { HomePage } from '@pages/HomePage'
import { SettingsPage, SettingsPageRef } from '@pages/SettingsPage'
import { StudyPage, StudyPageRef } from '@pages/StudyPage'
import { GetPlatform } from '@scripts/env'
import { Monke } from '@scripts/monke'
import { UserMonke } from '@scripts/user'
import { CollectionPage } from '@pages/CollectionPage'
import { Command } from '@scripts/command'
import { TCommand } from '@models/command'

enum Page {
  Home,
  Settings,
  Collection,
  Study,
}

export const App: React.FC = () => {
  const [isCMDHidden, setIsCMDHidden] = useState(true)
  const [cmdList, setCMDList]         = useState<string[]>([])

  const [isLoading,   setIsLoading]   = useState(true)
  const [isNavHidden, setIsNavHidden] = useState(true)
  const [page, setPage]               = useState(Page.Home)

  const settingsRef = useRef<SettingsPageRef>(null)
  const studyRef    = useRef<StudyPageRef>(null)
  const commandRef  = useRef<CommandPaletteRef>(null)

  const command = useMemo(() => new Command<TCommand>(), [])
  const monke   = useMemo(() => new Monke(), [])
  const user    = useMemo(() => new UserMonke(), [])

  useEffect(() => {
    command.sub(s => setCMDList(command.cmdStrings()))
    command.addBase('home', async () => setPage(Page.Home))
    command.addBase('settings', async () => setPage(Page.Settings))

    user.subjectSession.subscribe(s => setPage(Page.Study))
    user.init()

    monke.subjectIsLoading.subscribe(setIsLoading)
    monke.subjectCollection.subscribe(c => setPage(Page.Collection))
    monke.init()

    user.regiser(command)
    monke.register(command)
  }, [monke, user, command])

  const onReload = useCallback(() => {
    monke.load(monke.getSources())
  }, [monke])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    // Show Command Palette
    if (e.code === 'KeyP' && e.metaKey &&
        e.shiftKey && GetPlatform() === 'macOS') {
      setIsCMDHidden(false)
      e.preventDefault()
      return
    }
    if (e.code === 'KeyP' && e.ctrlKey && e.shiftKey &&
        GetPlatform() === 'Windows') {
      setIsCMDHidden(false)
      e.preventDefault()
      return
    }
    if (e.code === 'KeyK' && e.metaKey) {
      if (!isCMDHidden) {
        command.restore()
        commandRef.current?.onReset()
      } else setIsCMDHidden(!isCMDHidden)
      e.preventDefault()
      return
    }
    // Hide Command Palette
    if (e.key === 'Escape' && !isCMDHidden) {
      setIsCMDHidden(true)
      e.preventDefault()
      return
    }

    commandRef.current?.onKeyDown(e)
    if (!isCMDHidden) return
    studyRef.current?.onKeyDown(e)
  }, [command, isCMDHidden])

  const onClick = useCallback((e: MouseEvent) => {
    if (!isCMDHidden && e.target === commandRef.current?.target) {
      setIsCMDHidden(true)
      e.preventDefault()
      e.stopImmediatePropagation()
      return
    }
  }, [isCMDHidden, commandRef])

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
    if (page === Page.Home) command.restore()
    // TODO: Guard page change if there's no data
  }, [page, command])

  return (
    <div className="app md:w-[600px] md:mx-auto">
      {page === Page.Home       &&
      <HomePage
        isLoading={isLoading}
        monke={monke}
        user={user}
        command={command}
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
          onClick={() => setIsCMDHidden(false)} />
      </ToolsFloat>
      <CommandPalette
        ref={commandRef}
        isHidden={isCMDHidden}
        isLoading={isLoading}
        commandList={cmdList}
        onCommand={async cmd => command.run(cmd)}
        onHide={() => setIsCMDHidden(true)}
      />
    </div>
  )
}
