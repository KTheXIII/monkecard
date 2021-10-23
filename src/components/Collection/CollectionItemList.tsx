import React, {
  ReactElement, useEffect, useState
} from 'react'

import {
  MemoList, MemoListButtonItem, MemoListMarkItem
} from '@components/MemoList'
import { Item, EItemType } from '@models/collection'

interface Props {
  items: Map<string, Item>
}

interface KeywordSet {
  id: string
  items: string[]
}

export const CollectionItemList: React.FC<Props> = (props) => {
  const [memoList, setMemoList] = useState<KeywordSet[] | null>(null)
  const [quizList, setQuizList] = useState<KeywordSet[] | null>(null)
  const selectedSet = new Set<string>()

  useEffect(() => {
    const { items } = props
    if (!items) return

    const memoKeywordSet = Array.from(items.values())
      .filter(item => item.type === EItemType.Memo)
      .reduce((acc, item) => {
        item.keywords.forEach((keyword) => acc.add(keyword))
        return acc
      }, new Set<string>())
    const memoKeyWordList: KeywordSet[] = Array.from(memoKeywordSet.values())
      .map((keyword) => {
        return {
          id: keyword,
          items: Array.from(items.values())
            .filter((item) =>
              item.keywords.includes(keyword) && item.type === EItemType.Memo)
            .map((item) => item.id)
        }
      })
    if (memoKeyWordList.length > 0)
      setMemoList(memoKeyWordList)

    const quizKeywordSet = Array.from(items.values())
      .filter(item => item.type === EItemType.Question)
      .reduce((acc, item) => {
        item.keywords.forEach((keyword) => acc.add(keyword))
        return acc
      }, new Set<string>())
    const quizKeyWordList: KeywordSet[] = Array.from(quizKeywordSet.values())
      .map((keyword) => {
        return {
          id: keyword,
          items: Array.from(items.values())
            .filter((item) =>
              item.keywords.includes(keyword)
              && item.type === EItemType.Question)
            .map((item) => item.id)
        }
      })
    if (quizKeyWordList.length > 0)
      setQuizList(quizKeyWordList)
  }, [props])

  return (
    <div className="collection-item-list">
      {memoList && <MemoList text="memo" color="var(--text-dim)">
        {memoList.map((set, index) => (
          <MemoListMarkItem
            key={`${index + set.id}`}
            isMarked={selectedSet.has(set.id)}
            text={set.id}
            preview={`${set.items.length}`} />
        ))}
      </MemoList>}
      {quizList && <MemoList text="quiz" color="var(--text-dim)">
        {quizList.map((set, index) => (
          <MemoListButtonItem
            key={`${index + set.id}`}
            text={set.id}
            preview={`${set.items.length}`} />
        ))}
      </MemoList>}
    </div>
  )
}
