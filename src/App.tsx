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
import { DeckPage } from '@pages/DeckPage'
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
  // Application state is stored in these databases
  const monke = useMemo(() => new MonkeDB(), [])
  const deck  = useMemo(() => new DeckDB(), [])
  const card  = useMemo(() => new CardDB(), [])

  useEffect(() => {
    const loadingSub = deck.onLoading(setIsLoading)
    const selectSub  = deck.onSelect(id => id !== '' && setPage(Page.Collection))
    command.sub(s => setCMDList(command.cmdStrings()))
    command.addBase('home', async () => setPage(Page.Home))

    deck.init(monke, card)

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
      loadingSub.unsubscribe()
      selectSub.unsubscribe()
    }
  }, [command, deck, card, monke])

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
      <MonkeContext.Provider value={{ monke, deck, card, command }}>
        {page === Page.Home       &&
        <HomePage isLoading={isLoading} />}
        {page === Page.Collection &&
        <DeckPage isLoading={isLoading} />}
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
