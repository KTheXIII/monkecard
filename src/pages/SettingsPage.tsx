import React, {} from 'react'

import { MemoList, MemoListItem } from '@components/MemoList'
import { ICollectionSet } from '@models/dataset'

interface Props {
  collections: ICollectionSet[]
  onReload: () => void
}

export const SettingsPage: React.FC<Props> = (props) => {
  return (
    <div className="settings">
      <MemoList>
        {props.collections.reduce((acc, collection) => {
          collection.sources.forEach((source) => {
            if (source.data && source.data.title)
              acc.push(source.data.title)
            else acc.push(source.url)
          })
          return acc
        }, [] as string[])
          .map((name, index) => (
            <div key={name + index}
              className="group">
              <div className="ml-4 py-4 pr-4 text-left font-light flex flex-row
                              border-solid border-b border-mbg-0 group-last:border-b-0" >
                <div className="flex-grow min-w-0 w-0 overflow-scroll whitespace-nowrap">
                  {name}
                </div>
                <button className="rounded-memo">
                  <span className="px-4">edit</span>
                </button>
              </div>
            </div>
          ))}
      </MemoList>
    </div>
  )
}
