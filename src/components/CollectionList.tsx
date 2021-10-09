import React, { useState } from 'react'
import {
  MemoList,
  MemoListButtonItem
} from './MemoList'
import {
  CheckCircleFill,
  CircleSlash,
  DashCircleDotted,
  XCircleFill
} from '@assets/BootstrapIcons'

import { CollectionSource } from '@scripts/source'

export interface CollectionListItem {
  text: string
  preview: string
}

interface CollectionListProps {
  list: CollectionListItem[]
  onClick?: (index: number) => void
}

export const CollectionList: React.FC<CollectionListProps> = (props) => {
  const [count, setCount] = useState(0)
  return (
    <MemoList text="collections">
      {props.list.map((item, index) => {
        return (
          <MemoListButtonItem
            key={index}
            text={item.text}
            preview={item.preview}
            onClick={() => props.onClick && props.onClick(index)}
          />
        )})}
      <MemoListButtonItem text="count" onClick={() => {
        setCount(count + 1)
      }} preview={`${count}`} />
      <MemoListButtonItem text="much wow" isDisabled={true} preview={`${count}`} />
    </MemoList>
  )
}
