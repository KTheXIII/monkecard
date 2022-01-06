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
import { HomePage } from '@pages/HomePage'
import { CollectionPage } from '@pages/CollectionPage'
import { StudyPage, StudyPageRef } from '@pages/StudyPage'
import {
  GetPlatform,
  REPOSITORY_URL,
  SPONSOR_URL
} from '@scripts/env'
import { MonkeUser } from '@scripts/user'
import { MonkeCollection } from '@scripts/collection'
import { MonkeSession } from '@scripts/session'
import { Command } from '@scripts/command'
import { TCommand } from '@models/command'

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
  const user    = useMemo(() => new MonkeUser(), [])
  const collection = useMemo(() => new MonkeCollection(), [])
  const session = useMemo(() => new MonkeSession(), [])

  useEffect(() => {
    command.sub(s => setCMDList(command.cmdStrings()))
    command.addBase('home', async () => setPage(Page.Home))

    user.init()
    user.regiser(command)
    user.subIsLoading(setIsLoading)
    user.sub(u => session.setUser(u))

    session.sub(s => setPage(Page.Study))

    collection.subLoading(setIsLoading)
    collection.init()
    collection.subSelect(i => {
      if (i !== -1) setPage(Page.Collection)
    })
    collection.register(command)

    command.addBase('reload', async () => {
      await user.reload()
      await collection.load()
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
    command.addBase('sponsor', async () => {
      window.open(SPONSOR_URL, '_blank')
    })
  }, [user, command, collection, session])

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
    // if (e.key === 'Escape' && !isCMDHidden) {
    //   setIsCMDHidden(true)
    //   e.preventDefault()
    //   return
    // }

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
        user={user}
        collection={collection}
        command={command}
      />}
      {page === Page.Collection &&
      <CollectionPage
        isLoading={isLoading}
        user={user}
        collection={collection}
        command={command}
        session={session}
      />}
      {page === Page.Study      &&
      <StudyPage
        ref={studyRef}
        onHome={() => {
          setPage(Page.Home)
        }}
        user={user}
        command={command}
        session={session}
      />}

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
