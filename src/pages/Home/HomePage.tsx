import React, { useState } from 'react'

import { CollectionList, CollectionListItem } from '@components/CollectionList'
import { CollectionSource } from '@scripts/source'

interface HomePageProps {
  isLoading: boolean
}

export const HomePage: React.FC<HomePageProps> = (props) => {
  const [collectionList, setCollectionList] = useState<CollectionListItem[]>([
    { text: 'Loading...', preview: 'n/a' },
  ])

  return (
    <div className="home">
      <CollectionList list={collectionList} />
    </div>
  )
}
