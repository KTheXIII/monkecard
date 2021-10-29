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
import { Item, EItemType } from '@models/collection'

interface Props {
  items: Map<string, Item>
  onStart: (item: string[]) => void
}

interface KeywordSet {
  id: string
  items: string[],
}
enum EFilter {
  All,
  Memo,
  Quiz
}

const StartTexts = {
  Start: 'start',
  Selected: 'start selected'
}

export const CollectionItemList: React.FC<Props> = (props) => {
  const [itemList, setItemList]   = useState<KeywordSet[]>([])
  const [filter, setFilter]       = useState<EFilter>(EFilter.All)
  const [startText, setStartText] = useState<string>(StartTexts.Start)
  const [selected, setSelected]   = useState<Set<string>>(new Set())

  useEffect(() => {
    const { items } = props
    if (!items) return
    const keywords = Array.from(items.values())
      .filter((item) => {
        if (filter === EFilter.All)
          return true
        else if (filter === EFilter.Memo)
          return item.type === EItemType.Memo
        else if (filter === EFilter.Quiz)
          return item.type === EItemType.Question
        else
          return false
      })
      .reduce((acc, item) => {
        item.keywords.forEach((keyword) => acc.add(keyword))
        return acc
      }, new Set<string>())
    const keywordSetList: KeywordSet[] = Array.from(keywords.values())
      .map((keyword) => {
        return {
          id: keyword,
          items: Array.from(items.values())
            .filter((item) =>
              item.keywords.includes(keyword))
            .map((item) => item.id)
        }
      })
    setItemList(keywordSetList)
  }, [props, filter, selected])

  const onFilterClick = useCallback((f: EFilter) => {
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
    props.onStart(Array.from(itemIDSet.values()))
  }, [itemList, selected, props])

  return (
    <div className="collection-item-list">
      <div className="flex flex-row-reverse mb-3 gap-1">
        <ActionButton text={startText} onClick={() => onStartClick()} />
        {selected.size > 0 && <ActionButton text='clear' onClick={() => {
          selected.clear()
          if (selected.size > 0) setStartText(StartTexts.Selected)
          else setStartText(StartTexts.Start)
          setSelected(selected)
        }} />}
      </div>
      <div className="flex gap-1 overflow-x-scroll mb-3">
        <FilterButton text="all" active={filter === EFilter.All}
          onClick={() => onFilterClick(EFilter.All)} />
        <FilterButton text="memo" active={filter === EFilter.Memo}
          onClick={() => onFilterClick(EFilter.Memo)} />
        <FilterButton text="quiz" active={filter === EFilter.Quiz}
          onClick={() => onFilterClick(EFilter.Quiz)} />
      </div>
      <MemoList>
        {itemList.map((set, index) => (
          <MemoListMarkItem
            key={`${index + set.id}`}
            isMarked={selected.has(set.id)}
            onMark={(mark) => {
              if (mark) selected.add(set.id)
              else selected.delete(set.id)
              if (selected.size > 0) setStartText(StartTexts.Selected)
              else setStartText(StartTexts.Start)
              setSelected(selected)
            }}
            text={set.id}
            preview={`${set.items.length}`} />
        ))}
      </MemoList>
    </div>
  )
}
