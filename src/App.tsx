import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react'
import {
  BsFileEarmarkCodeFill,
  BsChevronRight
} from 'react-icons/bs'
import './app.css'

import {
  CommandPalette,
  CommandPaletteRef,
} from '@components/CommandPalette'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import { MonkeContext } from '@hooks/MonkeContext'
import { HomePage } from '@pages/HomePage'
import { StudyPageRef } from '@pages/StudyPage'

import { TCommand } from '@models/command'
import { Command } from '@scripts/command'
import {
  GetPlatform,
  REPOSITORY_URL,
  SPONSOR_URL
} from '@scripts/env'
import { DeckDB } from '@scripts/DeckDB'
import { CardDB } from '@scripts/CardDB'
import { MonkeDB } from '@scripts/MonkeDB'

enum Page {
  Home,
  Collection,
  Study,
}

export const App: React.FC = () => {
  const [isCMDHidden, setIsCMDHidden] = useState(true)
  const [cmdList, setCMDList]         = useState<string[]>([])

  const [isLoading,   setIsLoading]   = useState(true)
  const [isNavHidden, setIsNavHidden] = useState(true)
  const [page, setPage]               = useState(Page.Home)

  const studyRef    = useRef<StudyPageRef>(null)
  const commandRef  = useRef<CommandPaletteRef>(null)

  const command = useMemo(() => new Command<TCommand>(), [])
  const monkeDB = useMemo(() => new MonkeDB(), [])
  const deckDB  = useMemo(() => new DeckDB(), [])
  const cardDB  = useMemo(() => new CardDB(), [])

  useEffect(() => {
    const deckSub = deckDB.loading.subscribe(setIsLoading)

    command.sub(s => setCMDList(command.cmdStrings()))
    command.addBase('home', async () => setPage(Page.Home))

    deckDB.init(monkeDB, cardDB)

    command.addBase('sponsor', async () => {
      window.open(SPONSOR_URL, '_blank')
    })
    command.addBase('repository', async () => {
      window.open(`${REPOSITORY_URL}`, '_blank')
    })
    command.addBase('report bugs', async () => {
      window.open(`${REPOSITORY_URL}/issues`, '_blank')
    })
    command.addBase('docs', async () => {
      window.open(`${REPOSITORY_URL}/tree/trunk/docs`, '_blank')
    })

    return () => {
      deckSub.unsubscribe()
    }
  }, [command, deckDB, cardDB, monkeDB])

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
  }, [page, command])

  return (
    <div className="app md:w-[600px] md:mx-auto">
      <MonkeContext.Provider value={{ monke: monkeDB, deck: deckDB, card: cardDB }}>
        {page === Page.Home       &&
        <HomePage
          isLoading={isLoading}
          command={command}
        />}
      </MonkeContext.Provider>

      <ToolsFloat isHidden={isNavHidden}>
        <ToolsFloatButton
          text="home"
          icon={<BsFileEarmarkCodeFill />}
          onClick={() => {
            setPage(Page.Home)
          }} />
        <ToolsFloatButton
          text="cmd"
          icon={<BsChevronRight />}
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
