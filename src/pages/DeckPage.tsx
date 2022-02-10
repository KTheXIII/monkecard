import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Command } from '@scripts/command'
import { TCommand } from '@models/command'
import { EDeckStatus, IDeck } from '@models/Deck'
import { MonkeContext } from '@hooks/MonkeContext'
import { DeckCardList } from '@components/DeckCardList'

interface Props {
  isLoading: boolean
}

export const DeckPage: React.FC<Props> = (props) => {
  const { deck: deckDB, card: cardDB } = useContext(MonkeContext)
  const [title, setTitle] = useState<string>('')
  const [cardList, setCardList] = useState<string[]>([])

  const renderDeck = useCallback(async () => {
    if (!deckDB || !cardDB) return
    try {
      const current = await deckDB.getSelected() as IDeck
      if (current.status !== EDeckStatus.Loaded) return
      setTitle(current.title)
      setCardList(Array.from(current.cards))
      // const tags: Map<string, string[]> = new Map()
      // const ids = Array.from(current.cards)
      // for (let i = 0; i < ids.length; i ++) {
      //   const card = await cardDB.getCard(ids[i])
      //   card.tags.forEach((tag) => {
      //     tags.set(tag, [...(tags.get(tag) || []), card.id])
      //   })
      // }
      // const list: string[] = []
      // tags.forEach((count, tag) => {
      //   list.push(`${tag}(${count.length})`)
      // })
      // setItemList(list)
    } catch (err) { /* TODO: Handle error */ }
  }, [deckDB, cardDB])

  useEffect(() => {
    renderDeck()
  }, [renderDeck])

  return (
    <div className='pb-28 p-4'>
      <div>
        <h1>{title}</h1>
      </div>
      <DeckCardList cardIDs={cardList} />
    </div>
  )
}
