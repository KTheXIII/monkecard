import React, {
  useEffect,
  useState,
  useCallback,
  useContext
} from 'react'

import {
  MemoList,
  MemoListMarkItem
} from '@components/MemoList'
import { ActionButton, FilterButton } from '@components/ButtonUtilities'
import { ECardType } from '@models/Card'
import { MonkeContext } from '@hooks/MonkeContext'
import { CardDB } from '@scripts/CardDB'

const START_TEXTS = {
  Start: 'start',
  Selected: 'start selected'
}
const DEFAULT_FILTER = ECardType.Memo

interface Props {
  cardIDs: string[]
}

interface TagSet {
  id: string
  items: string[],
}

export const DeckCardList: React.FC<Props> = (props) => {
  const { card: cardDB } = useContext(MonkeContext)

  const [itemList,  setItemList]  = useState<TagSet[]>([])
  const [filter,    setFilter]    = useState<ECardType>(DEFAULT_FILTER)
  const [startText, setStartText] = useState<string>(START_TEXTS.Start)
  const [selected,  setSelected]  = useState<Set<string>>(new Set())

  const renderCards = useCallback(async (ids: string[], filter: ECardType, db: CardDB) => {
    const tagMap = new Map<string, string[]>()
    for (let i = 0; i < ids.length; i ++) {
      const key = ids[i]
      const card = await db.getCard(key)
      if (card.type !== filter) continue
      card.tags.forEach((tag) =>
        tagMap.set(tag, [...(tagMap.get(tag) || []), key])
      )
    }
    const tagSet: TagSet[] = []
    tagMap.forEach((items, tag) => {
      tagSet.push({ id: tag, items })
    })
    setItemList(tagSet)
  }, [])

  // Auto switch to Question filter if Memo item list is empty
  useEffect(() => {
    if (!cardDB) return
    const { cardIDs } = props
    renderCards(cardIDs, filter, cardDB)
  }, [cardDB, filter, props, renderCards])

  const onFilterClick = useCallback((f: ECardType) => {
    if (f !== filter) {
      selected.clear()
      setSelected(selected)
      setStartText(START_TEXTS.Start)
    }
    setFilter(f)
  }, [filter, selected])

  const onStartClick = useCallback(() => {
    const itemIDSet = selected.size == 0 ? itemList.reduce((acc, set) => {
      set.items.forEach((id) => acc.add(id))
      return acc
    }, new Set<string>()) : itemList.reduce((acc, set) => {
      if (selected.has(set.id)) set.items.forEach((id) => acc.add(id))
      return acc
    }, new Set<string>())
    // props.onStart(filter, Array.from(itemIDSet.values()))
  }, [selected, itemList])

  return (
    <div className="collection-item-list">
      <div className="flex flex-row-reverse mb-3 gap-1">
        <ActionButton text={startText} onClick={() => onStartClick()} />
        {selected.size > 0 && <ActionButton text='clear' onClick={() => {
          selected.clear()
          if (selected.size > 0) setStartText(START_TEXTS.Selected)
          else setStartText(START_TEXTS.Start)
          setSelected(selected)
        }} />}
      </div>
      <div className="flex gap-1 overflow-x-auto mb-3">
        <FilterButton text="memo" active={filter === ECardType.Memo}
          onClick={() => onFilterClick(ECardType.Memo)} />
        <FilterButton text="quiz" active={filter === ECardType.Question}
          onClick={() => onFilterClick(ECardType.Question)} />
      </div>
      <MemoList>
        {itemList.map((set, index) => (
          <MemoListMarkItem
            key={`${index}`}
            isMarked={selected.has(set.id)}
            onMark={(mark) => {
              if (mark) selected.add(set.id)
              else selected.delete(set.id)
              if (selected.size > 0) setStartText(START_TEXTS.Selected)
              else setStartText(START_TEXTS.Start)
              setSelected(selected)
            }}
            text={set.id}
            preview={`${set.items.length}`} />
        ))}
      </MemoList>
    </div>
  )
}
