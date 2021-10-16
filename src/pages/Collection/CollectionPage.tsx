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
    <div className="collection-page">
      <div className="collection-header">
        <h1>{title}</h1>
      </div>
      <CollectionDescription text={description} />
      <CollectionItemList items={items} />
    </div>
  )
}
