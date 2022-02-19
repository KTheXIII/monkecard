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
  ToolsFloat,
  ToolsFloatButton
} from '@components/ToolsFloat'
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
import { Command } from '@commands/command'
import {
  OpenDeck,
  OpenCard,
  OpenPage
} from '@commands/OpenCommands'

enum Page {
  Home,
  Collection,
  Study,
}
// const PageNames = Object.keys(Page).map(p => Page[p as never])
//   .filter(n => typeof n !== 'number')
// type TPage = keyof typeof Page

export const App: React.FC = () => {
  const [isLoading,   setIsLoading]   = useState(true)
  const [isNavHidden, setIsNavHidden] = useState(false)
  const [page,        setPage]        = useState(Page.Home)

  const studyRef   = useRef<StudyPageRef>(null)
  const commandRef = useRef<CommandPaletteRef>(null)

  // Application state is stored in these databases
  const command = useMemo(() => new Command(), [])
  const monke   = useMemo(() => new MonkeDB(), [])
  const deck    = useMemo(() => new DeckDB(),  [])
  const card    = useMemo(() => new CardDB(),  [])

  useEffect(() => {
    if (commandRef.current) {
      const ref = commandRef.current
      command.init({
        setHint: ref.setHint,
        setCommands: ref.setCommands,
        isHidden: ref.isHidden,
        setIsHidden: ref.setIsHidden,
        isInput: ref.isInput,
        setIsInput: ref.setIsInput,
        setMessage: ref.setMessage,
        setSearch: ref.setSearch,
      })
    }

    const loadingSub = deck.onLoading(setIsLoading)
    const selectSub  = deck.onSelect(id => id !== '' && setPage(Page.Collection))
    deck.init(monke, card)
    const deckCommand = new OpenDeck(deck)
    // const cardCommand = new OpenCard(card)
    command.register(deckCommand)
    // command.register(cardCommand)
    command.register(new OpenPage('home', () => setPage(Page.Home)))

    return () => {
      loadingSub.unsubscribe()
      selectSub.unsubscribe()
      command.unregister(deckCommand)
      // command.unregister(cardCommand)
    }
  }, [deck, card, monke, command])

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
      <MonkeContext.Provider value={{ monke, deck, card, cmd: command }}>
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
        onRun={cmd => command.run(cmd)}
        onEval={text => command.eval(text)}
        onInput={input => command.input(input)}
        onExpand={cmd => command.eval(cmd)} />
    </div>
  )
}
