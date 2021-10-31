import React, { forwardRef, useImperativeHandle } from 'react'
import { FileCode, Pen } from '@assets/BootstrapIcons'

import {
  MemoList,
  MemoListButtonItem,
} from '@components/MemoList'
import { ICollectionSet } from '@models/dataset'
import {
  COMMIT_HASH, REPOSITORY_URL, VERSION
} from '@scripts/env'

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
    <div className="settings h-full flex flex-col">
      <div className="flex-grow p-4">
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
      <div className="text-center font-mono text-sm font-light pb-24">
        <a
          title="Github repository link"
          className="text-mt-1 transition-colors duration-100x ease-in hover:text-mt-0"
          rel="noreferrer"
          target="_blank"
          href={REPOSITORY_URL}>
            v{VERSION}-{COMMIT_HASH.substring(0, 7)}
        </a>
        {/* <a
          title="report bugs link"
          className="ml-4 text-mt-1 transition-colors duration-100x ease-in hover:text-mt-0"
          rel="noreferrer"
          target="_blank"
          href={`${REPOSITORY_URL}/issues`}
        >report bugs</a> */}
      </div>
    </div>
  )
})
