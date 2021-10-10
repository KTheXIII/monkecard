import React, {
  useEffect,
  useState
} from 'react'

import { CollectionDescription } from '@components/Collection/CollectionDescription'
import { ICollectionSet } from '@models/dataset'
import { ICollection } from '@models/collection'

interface CollectionPageProps {
  collectionSet?: ICollectionSet
}

export const CollectionPage: React.FC<CollectionPageProps> = (props) => {
  const set = props.collectionSet
  const [collectionTitle, setCollectionTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    if (!set) return
    if (set.collection) {
      setCollectionTitle(set.collection.title)
      setDescription(set.collection.description)
    }
  }, [set])

  return (
    <div className="collection-page">
      <div className="collection-header">
        <h1>{collectionTitle}</h1>
      </div>
      <CollectionDescription text={description} />
    </div>
  )
}
