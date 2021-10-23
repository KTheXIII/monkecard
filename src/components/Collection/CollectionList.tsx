import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'
import {
  MemoList,
  MemoListButtonItem
} from '@components/MemoList'
import {
  CheckCircleFill,
  CircleSlash,
  DashCircleDotted,
  XCircleFill
} from '@assets/BootstrapIcons'

export interface CollectionListItem {
  text: string
  preview: string
}

interface IProps {
  list?: CollectionListItem[]
  onClick?: (index: number) => void
}

export const CollectionList: React.FC<IProps> = (props) => {
  const [items, setItems] = useState<ReactElement[]>([])

  useEffect(() => {
    if (props.list) {
      setItems(props.list.map((item, index) => (
        <MemoListButtonItem
          key={index}
          text={item.text}
          preview={item.preview}
          onClick={() => props.onClick && props.onClick(index)}
        />
      )))
    }
  }, [props])

  return (
    <MemoList text="collections">
      {items}
    </MemoList>
  )
}
