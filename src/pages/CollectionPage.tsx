import React, {
  useEffect,
  useState
} from 'react'

import { CollectionDescription } from '@components/Collection/CollectionDescription'
import { ICollectionSet } from '@models/dataset'
import { CollectionItemList } from '@components/Collection/CollectionItemList'

interface CollectionPageProps {
  set: ICollectionSet
}

export const CollectionPage: React.FC<CollectionPageProps> = (props) => {
  const { collection } = props.set
  const { title, description, items } = collection
  return (
    <div className="collection-page pb-40">
      <div className="collection-header pb-10">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <CollectionDescription text={description} />
      {/* <div className="flex">
        <button
          onClick={() => {
            console.log('play')
          }}
          className="m-auto bg-mbg-1 px-5 rounded-me py-1 hover:bg-mbg-2 active:bg-mbg-3"
        >Memo</button>
      </div> */}
      <CollectionItemList items={items} />
    </div>
  )
}
