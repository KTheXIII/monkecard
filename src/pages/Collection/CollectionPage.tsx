import React, {
  useEffect,
  useState
} from 'react'

import { ICollectionSet } from '@models/dataset'
import { ICollection } from '@models/collection'

interface CollectionPageProps {
  collectionSet?: ICollectionSet
}

export const CollectionPage: React.FC<CollectionPageProps> = (props) => {
  const set = props.collectionSet
  const [collection, setCollection] = useState<ICollection>()

  useEffect(() => {
    if (set && set.collection)
      setCollection(set.collection)
  }, [set])

  return (
    <div className="collection-page">
      <div className="collection-info">
        <div className="header">
          <h1>{collection && collection.title}</h1>
        </div>
        <div className="description">
          <span>description</span>
          <div className="content">
            {collection && collection.description}
          </div>
        </div>
      </div>
    </div>
  )
}
