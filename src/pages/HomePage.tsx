import React, {
  useState,
  useEffect
} from 'react'

import { CollectionList, CollectionListItem } from '@components/Collection/CollectionList'
import { ICollectionSet } from '@models/dataset'
import { CollectionPage } from '@pages/Collection'
import { MemoCard } from '@components/MemoItem/MemoCard'
import { Item, Memo } from '@models/collection'

enum EActive {
  List,
  Collection
}

interface HomePageProps {
  isLoading: boolean
  collections: ICollectionSet[]
  isActive: boolean
}

export const HomePage: React.FC<HomePageProps> = (props) => {
  const { collections } = props
  const [collectionList, setCollectionList] = useState<CollectionListItem[]>([
    { text: 'Loading...', preview: 'error' },
  ])
  const [selectedCollection, setSelectedCollection] = useState<ICollectionSet>()
  const [active, setActive] = useState(EActive.List)

  const [item, setItem] = useState<Item>()

  useEffect(() => {
    setCollectionList(collections.map(s => {
      if (s.collection) return {
        text: s.collection.title,
        preview: `${s.collection.items.size}`,
      }
      else return {
        text: s.sources.length > 0 ? s.sources[0].url : 'unknown',
        preview: 'error fetching',
      }
    }))
    if (collections.length > 0) {
      setSelectedCollection(collections[0])
      setItem(collections[0].collection.items.get('MA209A-P281M05'))
    }
  }, [collections])

  return (
    <div className="home p-4">
      {/* {active === EActive.List &&
      <CollectionList list={collectionList} onClick={index => {
        setSelectedCollection(collections[index])
        setActive(EActive.Collection)
      }} />} */}
      {item && <MemoCard memo={item as Memo} />}
      {/* {active === EActive.Collection &&
       selectedCollection && <CollectionPage set={selectedCollection} />} */}
    </div>
  )
}
