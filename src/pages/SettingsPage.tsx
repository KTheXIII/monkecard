import React, {} from 'react'
import { Clock } from '@assets/BootstrapIcons'

import {
  MemoList,
  MemoListItem,
  MemoListInputText,
  MemoListButtonItem,
  MemoListSwitchITP
} from '@components/MemoList'
import { ICollectionSet } from '@models/dataset'

interface Props {
  collections: ICollectionSet[]
  onReload: () => void
}

export const SettingsPage: React.FC<Props> = (props) => {
  return (
    <div className="settings">
      <MemoList>
        <MemoListButtonItem text="Hello, World!" preview="wow" />
      </MemoList>
    </div>
  )
}
