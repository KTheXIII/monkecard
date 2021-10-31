import React, {
  useEffect,
  useState,
  useCallback
} from 'react'

import {
  MemoList,
  MemoListMarkItem
} from '@components/MemoList'
import { ActionButton, FilterButton } from '@components/ButtonUtilities'
import { EItemType } from '@models/collection'
import { ItemSource } from '@models/source'

const START_TEXTS = {
  Start: 'start',
  Selected: 'start selected'
}
const DEFAULT_FILTER = EItemType.Memo

interface Props {
  items: Map<string, ItemSource>
  onStart: (type: EItemType, item: string[]) => void
}

interface KeywordSet {
  id: string
  items: string[],
}

export const CollectionItemList: React.FC<Props> = (props) => {
  const [itemList,  setItemList]  = useState<KeywordSet[]>([])
  const [filter,    setFilter]    = useState<EItemType>(DEFAULT_FILTER)
  const [startText, setStartText] = useState<string>(START_TEXTS.Start)
  const [selected,  setSelected]  = useState<Set<string>>(new Set())

  useEffect(() => {
    const { items } = props
    if (!items) return
    // Filter out the keywords
    const filteredKeywords = Array.from(items.values())
      .filter((item) => {
        return item.type === filter
      })
      .reduce((acc, item) => {
        item.keywords.forEach((keyword) => acc.add(keyword))
        return acc
      }, new Set<string>())
    // Create Keyword set list for displaying
    const keywordList: KeywordSet[] = Array.from(filteredKeywords.values())
      .map((keyword) => {
        return {
          id: keyword,
          items: Array.from(items.values())
            .filter((item) =>
              item.keywords.includes(keyword))
            .map((item) => item.id)
        }
      })
    setItemList(keywordList)
  }, [props, filter, selected])

  // Auto switch to Question filter if Memo item list is empty
  useEffect(() => {
    const { items } = props
    if (!items) return
    const count = Array.from(items.values())
      .reduce((acc, item) => acc + (item.type === EItemType.Memo ? 1 : 0), 0)
    if (count === 0) setFilter(EItemType.Question)
  }, [props])

  const onFilterClick = useCallback((f: EItemType) => {
    if (f !== filter) {
      selected.clear()
      setSelected(selected)
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
    props.onStart(filter, Array.from(itemIDSet.values()))
  }, [selected, itemList, props, filter])

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
      <div className="flex gap-1 overflow-x-scroll mb-3">
        <FilterButton text="memo" active={filter === EItemType.Memo}
          onClick={() => onFilterClick(EItemType.Memo)} />
        <FilterButton text="quiz" active={filter === EItemType.Question}
          onClick={() => onFilterClick(EItemType.Question)} />
      </div>
      <MemoList>
        {itemList.map((set, index) => (
          <MemoListMarkItem
            key={`${index + set.id}`}
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
