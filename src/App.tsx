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

  const monke = useMemo(() => new Monke(), [])
  const user  = useMemo(() => new UserMonke(), [])

  useEffect(() => {
    user.subjectSession.subscribe(s => setPage(Page.Study))
    user.init()
    monke.subjectIsLoading.subscribe(setIsLoading)
    monke.subjectCollection.subscribe(c => setPage(Page.Collection))
    monke.init()

    monke.subjectCommands.subscribe((cmds) =>
      setCMDList(Array.from(cmds.keys())))
    monke.addCommand('home', async () => {
      setPage(Page.Home)
      return { success: true }
    })
    monke.addCommand('settings', async () => {
      setPage(Page.Settings)
      return { success: true }
    })
    user.registerCommands(monke)
    monke.addCommand('scroll', async () => {
      monke.subjectCommands.next(new Map([
        ['top', async () => window.scrollTo({
          top: 0, left: 0,
          behavior: 'smooth'
        })],
      ]))
      return {
        success: false,
        restore: monke.restoreCommands.bind(monke)
      }
    })
    monke.registerCommands()
  }, [monke, user])

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
      setIsCMDHidden(!isCMDHidden)
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
  }, [isCMDHidden, studyRef])

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
    if (page === Page.Home) monke.restoreCommands()
    // TODO: Guard page change if there's no data
  }, [page, monke])

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
          onClick={() => setIsCMDHidden(false)} />
      </ToolsFloat>
      <CommandPalette
        ref={commandRef}
        isHidden={isCMDHidden}
        isLoading={isLoading}
        commandList={cmdList}
        onCommand={async cmd => monke.runCommand(cmd)}
        onHide={() => setIsCMDHidden(true)}
      />
    </div>
  )
}
