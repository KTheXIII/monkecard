import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'
import {
  MemoList,
  MemoListButtonItem
} from '@components/MemoList'

import { ICollectionSet } from '@models/dataset'

interface IProps {
  set: ICollectionSet[]
  onClick?: (index: number) => void
}

export const CollectionList: React.FC<IProps> = (props) => {
  return (
    <MemoList text="collections">
      {props.set.map((set, index) => {
        return (
          <MemoListButtonItem
            key={index}
            text={set.collection.title}
            preview={`${set.collection.items.size}`}
            onClick={() => props.onClick && props.onClick(index)}
          />
        )
      })}
    </MemoList>
  )
}
