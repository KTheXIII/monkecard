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

import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import {
  CommandPalette,
  CommandPaletteRef,
} from '@components/CommandPalette'
import { MonkeContext } from '@hooks/MonkeContext'
import { HomePage } from '@pages/HomePage'
import { DeckPage } from '@pages/DeckPage'
import { StudyPageRef } from '@pages/StudyPage'

import { CommandKeyBinds, CommandMouseBinds } from '@scripts/MonkeBindings'
import { DeckDB } from '@scripts/DeckDB'
import { CardDB } from '@scripts/CardDB'
import { MonkeDB } from '@scripts/MonkeDB'

enum Page {
  Home,
  Collection,
  Study,
}

export const App: React.FC = () => {
  const [isLoading,   setIsLoading]   = useState(true)
  const [isNavHidden, setIsNavHidden] = useState(false)
  const [page,        setPage]        = useState(Page.Home)

  const studyRef    = useRef<StudyPageRef>(null)
  const commandRef  = useRef<CommandPaletteRef>(null)

  // Application state is stored in these databases
  const monke = useMemo(() => new MonkeDB(), [])
  const deck  = useMemo(() => new DeckDB(), [])
  const card  = useMemo(() => new CardDB(), [])

  useEffect(() => {
    const loadingSub = deck.onLoading(setIsLoading)
    const selectSub  = deck.onSelect(id => id !== '' && setPage(Page.Collection))
    deck.init(monke, card)
    return () => {
      loadingSub.unsubscribe()
      selectSub.unsubscribe()
    }
  }, [deck, card, monke])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const cmd = commandRef.current
    if (cmd && CommandKeyBinds(e, cmd))  {
      e.preventDefault()
      return
    }
  }, [])

  const onClick = useCallback((e: MouseEvent) => {
    const cmd = commandRef.current
    if (cmd && CommandMouseBinds(e, cmd)) return
  }, [commandRef])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('click', onClick)
    }
  }, [onKeyDown, onClick])

  return (
    <div className="app md:w-[600px] md:mx-auto">
      <MonkeContext.Provider value={{ monke, deck, card }}>
        {page === Page.Home       &&
        <HomePage isLoading={isLoading} />}
        {page === Page.Collection &&
        <DeckPage isLoading={isLoading} />}
      </MonkeContext.Provider>

      <ToolsFloat isHidden={isNavHidden}>
        <ToolsFloatButton
          text="home"
          icon={<BsFileEarmarkCodeFill />}
          onClick={() => setPage(Page.Home)} />
        <ToolsFloatButton
          text="cmd"
          icon={<BsChevronRight />}
          onClick={() => commandRef.current?.setIsHidden(false)} />
      </ToolsFloat>
      <CommandPalette ref={commandRef}
        onRun={(cmd, args) => {
          // TODO: Implement this
          console.log(cmd, args)
        }}
        onInput={input => {
          // TODO: Implement this
          console.log(input)
        }}
        onExpand={cmd => {
          // TODO: Implement this
          console.log(cmd)
        }}
        onShrink={text => {
          // TODO: Implement this
          console.log(text)
        }} />
    </div>
  )
}
