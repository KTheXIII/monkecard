import React, {
  useState,
  useEffect
} from 'react'

import { CollectionList, CollectionListItem } from '@components/Collection/CollectionList'
import { ICollectionSet } from '@models/dataset'
import { CollectionPage } from '@pages/Collection'
import { MemoCard } from '@components/MemoItem/MemoCard'

interface HomePageProps {
  isLoading: boolean
  collections: ICollectionSet[]
  isActive: boolean
}

const testText = `
What is this?

$$
a^2 + b^2 = c^2
$$
`

const wowText = `
much wow
`

export const HomePage: React.FC<HomePageProps> = (props) => {
  const { collections } = props
  const [collectionList, setCollectionList] = useState<CollectionListItem[]>([
    { text: 'Loading...', preview: 'error' },
  ])
  const [selectedCollection, setSelectedCollection] = useState<ICollectionSet>()

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
    if (collections.length > 0)
      setSelectedCollection(collections[0])
  }, [collections])

  return (
    <div className="home">
      {/* <CollectionList list={collectionList} onClick={index => {
        setSelectedCollection(collections[index])
      }} /> */}
      <div className="test">
        <MemoCard front={testText} back={wowText} />
      </div>
      {/* {selectedCollection && <CollectionPage set={selectedCollection} />} */}
    </div>
  )
}
