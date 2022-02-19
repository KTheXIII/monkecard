import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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
    } catch (err) { /* TODO: Handle error */ }
  }, [deckDB, cardDB])

  useEffect(() => {
    if (!deckDB) return
    const sub = deckDB.onSelect(() => renderDeck())
    renderDeck()
    return () => sub.unsubscribe()
  }, [renderDeck, deckDB])

  return (
    <div className='pb-28 p-4'>
      <div>
        <h1>{title}</h1>
      </div>
      <DeckCardList cardIDs={cardList} />
    </div>
  )
}
