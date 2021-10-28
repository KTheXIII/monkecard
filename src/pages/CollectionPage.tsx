import React, {
} from 'react'

import { CollectionDescription } from '@components/Collection/CollectionDescription'
import { ICollectionSet } from '@models/dataset'
import { CollectionItemList } from '@components/Collection/CollectionItemList'
import { Item } from '@models/collection'

interface CollectionPageProps {
  set: ICollectionSet
  onStart: (item: Item[]) => void
}

export const CollectionPage: React.FC<CollectionPageProps> = (props) => {
  const { collection } = props.set
  const { title, description, items } = collection

  return (
    <div className="collection-page pb-40 flex flex-col">
      <div className="collection-header pb-10">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <CollectionDescription text={description} />
      <CollectionItemList items={items} onStart={(ids: string[]) => {
        console.log('start', ids)
      }} />
    </div>
  )
}
