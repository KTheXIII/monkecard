import React, {
  useState,
  useEffect,
  useCallback
} from 'react'

import { CollectionDescription } from '@components/Collection/CollectionDescription'
import { ICollectionSet } from '@models/dataset'
import { CollectionItemList } from '@components/Collection/CollectionItemList'
import { EItemType, Item } from '@models/collection'
import { Monke } from '@scripts/monke'
import { UserMonke } from '@scripts/user'
import { MemoList } from '@components/MemoList'
import { ItemSource } from '@models/source'
import { createItemFromSource } from '@scripts/collection'
import { createSession } from '@models/study'

interface Props {
  monke: Monke
  user: UserMonke
  isLoading: boolean
  // onStart: (type: EItemType, itemIDs: string[]) => void
}

export const CollectionPage: React.FC<Props> = (props) => {
  const { monke, user, isLoading } = props
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<Map<string, ItemSource>>()
  const [description, setDescription] = useState('')
  const [collectionSet, setCollectionSet] = useState<ICollectionSet>()

  const onStartSession = useCallback((type: EItemType, ids: string[]) => {
    if (!collectionSet) return
    const items = ids.reduce((acc, id) => {
      // TODO: Compute hash with links to the source and item contents
      const item = collectionSet.collection.items.get(id)
      if (item) acc.push(createItemFromSource(item))
      return acc
    }, [] as Item[])
    user.subjectSession.next(createSession(type, items))
  }, [collectionSet, user])

  useEffect(() => {
    const set = monke.getCollection()
    if (!set) return
    const { collection } = set
    setCollectionSet(set)
    setTitle(collection.title)
    setDescription(collection.description)
    setItems(collection.items)
    const sub = monke.subjectCollection.subscribe(index => {
      setCollectionSet(monke.getCollections()[index])
    })
    return () => sub.unsubscribe()
  }, [monke, isLoading])

  useEffect(() => {
    if (!collectionSet) return
    setTitle(collectionSet.collection.title)
    setDescription(collectionSet.collection.description)
    setItems(collectionSet.collection.items)
  }, [collectionSet])

  return (
    <div className="collection-page pb-40 flex flex-col p-4">
      <div className="collection-header pb-10">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <CollectionDescription text={description} />
      {items && <CollectionItemList
        items={items}
        onStart={(type, ids) => onStartSession(type, ids)}
      />}
    </div>
  )
}
