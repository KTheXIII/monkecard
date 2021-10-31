import React, { forwardRef, useImperativeHandle } from 'react'
import { FileCode, Pen } from '@assets/BootstrapIcons'

import {
  MemoList,
  MemoListButtonItem,
} from '@components/MemoList'
import { ICollectionSet } from '@models/dataset'

interface Props {
  collections: ICollectionSet[]
  onReload: () => void
}

export interface SettingsPageRef {
  onActive: () => void
}

export const SettingsPage = forwardRef<SettingsPageRef, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    onActive: () => {
      console.log('SettingsPage.onActive')
    },
  }))

  return (
    <div className="settings p-4">
      <MemoList>
        <MemoListButtonItem
          iconL={FileCode}
          hideIconL={false}
          iconR={Pen}
          hideIconR={false}
          text="edit sources"
          onClick={() => {
            // TODO: edit sources page
          }}
        />
      </MemoList>
    </div>
  )
})
