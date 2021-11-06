import React from 'react'
import { FileCode, Pen } from '@assets/BootstrapIcons'
import {
  MemoList,
  MemoListButtonItem,
} from '@components/MemoList'

interface Props {
  onEditSource?: () => void
}

export const SettingsMain: React.FC<Props> = (props) => {
  return (
    <div>
      <MemoList>
        <MemoListButtonItem
          iconL={FileCode}
          hideIconL={false}
          iconR={Pen}
          hideIconR={false}
          text="edit sources"
          onClick={props.onEditSource}
        />
      </MemoList>
    </div>
  )
}
