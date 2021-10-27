import React, {
  useEffect,
  useState
} from 'react'

import {
  MemoList,
  MemoListMarkItem
} from '@components/MemoList'
import { Item, EItemType } from '@models/collection'

interface Props {
  items: Map<string, Item>
}

interface KeywordSet {
  id: string
  items: string[]
}

const FilterButton: React.FC<{
  text: string,
  active: boolean,
  onClick?: () => void
}> = (props) => {
  return (
    <button className={`text-mt-1 w-16 h-7 rounded-me
    ${props.active && 'text-mt-0'}
    transition-colors duration-150 ease-out hover:text-mt-0`}
    onClick={() => props.onClick && props.onClick()}>
      {props.text}
    </button>
  )
}

enum EFilter {
  All,
  Memo,
  Quiz
}

export const CollectionItemList: React.FC<Props> = (props) => {
  const [itemList, setItemList] = useState<KeywordSet[]>([])
  const [filter, setFilter] = useState<EFilter>(EFilter.All)
  const selectedSet = new Set<string>()

  useEffect(() => {
    const { items } = props
    if (!items) return
    const keywords = Array.from(items.values())
      .filter((item) => {
        if (filter === EFilter.All) return true
        if (filter === EFilter.Memo
          && item.type === EItemType.Memo) return true
        else if (filter === EFilter.Quiz
           && item.type === EItemType.Question) return true
        else return false
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
  }, [props, filter])

  return (
    <div className="collection-item-list">
      <div className="flex gap-1 overflow-x-scroll mb-3">
        <FilterButton text="all" active={filter === EFilter.All} onClick={() => setFilter(EFilter.All)} />
        <FilterButton text="memo" active={filter === EFilter.Memo} onClick={() => setFilter(EFilter.Memo)} />
        <FilterButton text="quiz" active={filter === EFilter.Quiz} onClick={() => setFilter(EFilter.Quiz)} />
      </div>
      <MemoList>
        {itemList.map((set, index) => (
          <MemoListMarkItem
            key={`${index + set.id}`}
            isMarked={selectedSet.has(set.id)}
            text={set.id}
            preview={`${set.items.length}`} />
        ))}
      </MemoList>
    </div>
  )
}
