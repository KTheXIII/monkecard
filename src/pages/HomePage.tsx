import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react'

import { IActivity } from '@models/user'
import { MemoHeatmap } from '@components/MemoHeatmap'
import {
  REPOSITORY_URL,
  FORMATED_VERSION,
  MODE,
  BUILD_DATE
} from '@scripts/env'
import { MemoList, MemoListButtonItem } from '@components/MemoList'
import { Command } from '@scripts/command'
import { TCommand } from '@models/command'
import {
  EDeckStatus,
  IDeck,
  IDeckBase
} from '@models/Deck'
import { MonkeContext } from '@hooks/MonkeContext'

interface Props {
  isLoading: boolean
  command: Command<TCommand>
}

interface TextItem {
  text: string
  preview: string
  id: string
}

export const HomePage: React.FC<Props> = (props) => {
  const { isLoading, command } = props
  const { monke, deck } = useContext(MonkeContext)
  const [deckList, setDeckList] = useState<TextItem[]>([])

  const [heats, setHeats] = useState<IActivity[]>([])
  const colors = useMemo(() => {
    const base = getComputedStyle(document.body)
      .getPropertyValue('--activity-min').trim()
    const max = getComputedStyle(document.body)
      .getPropertyValue('--blue').trim()
    const colorBase = parseInt(base.slice(1), 16)
    const colorMax = parseInt(max.slice(1), 16)
    return [colorBase, colorMax] as [number, number]
  }, [])

  const renderDecks = useCallback(async () => {
    if (!deck) return
    const keys = await deck.getDeckKeys()
    const items: TextItem[] = []
    for (let i = 0; i < keys.length; i++) {
      const deckData = await deck.getDeck(keys[i])
      let text = 'loading...'
      let preview = '(￣ω￣)'

      switch (deckData.status) {
      case EDeckStatus.Loaded: {
        const deck = deckData as IDeck
        text = deck.title
        preview = `${deck.cards.size}`
        break
      }
      case EDeckStatus.Error: {
        text = 'error'
        preview = '(￣ω￣)'
        break
      }
      case EDeckStatus.Loading:
      default:
        break
      }
      items.push({ text, preview, id: keys[i] })
    }
    setDeckList(items)
  }, [deck])

  const renderHeats = useCallback(async () => {
    if (!monke) return
  }, [monke])

  const onDeckOpen = useCallback(async (id: string) => {
    // TODO: Open deck
  }, [deck])

  useEffect(() => {
    command.restore()
  }, [command])

  useEffect(() => {
    renderDecks()
    renderHeats()
  }, [isLoading, renderDecks, renderHeats])

  return (
    <div className="home px-4 pt-4">
      <div className='mb-5 mt-5'>
        <h1 className='text-3xl text-mtext-dim-1'>
          {isLoading ? 'loading...' :  'error user'}
        </h1>
      </div>
      <div className='pb-2 ml-1 text-mtext-dim-1'>activity</div>
      <MemoHeatmap heats={heats} colors={colors} />
      <div className='flex font-mono font-light text-sm mt-2 space-y-0 flex-col text-mtext-dim-2'>
        {MODE === 'staging' && <p className='ml-auto'>build: {BUILD_DATE}</p>}
        <a
          title="Github repository link"
          className="transition-colors ml-auto duration-100x ease-in hover:text-mtext-hover"
          rel="noreferrer"
          target="_blank"
          href={REPOSITORY_URL}>
          {FORMATED_VERSION}
        </a>
      </div>
      <MemoList text='collections'>
        {deckList.map((item, index) => (
          <MemoListButtonItem key={index}
            text={item.text} preview={item.preview}
            onClick={() => onDeckOpen(item.id)} />
        ))}
      </MemoList>
    </div>
  )
}
