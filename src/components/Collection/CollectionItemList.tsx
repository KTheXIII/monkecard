import React, { useEffect } from 'react'

import { MemoList, MemoListButtonItem } from '@components/MemoList'
import { ICollectionSet } from '@models/dataset'
import { Item } from '@models/collection'

import './collection-item-list.scss'

interface Props {
  items: Map<string, Item>
}

export const CollectionItemList: React.FC<Props> = (props) => {
  const selectedSet = new Set<string>()
  useEffect(() => {
    console.log(props.items)
  }, [props])

  return (
    <div className="collection-item-list">
      <MemoList text="quiz" color="var(--text-dim)">
      </MemoList>
    </div>
  )
}
