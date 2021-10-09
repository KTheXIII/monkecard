import { h, FunctionalComponent as Func } from 'preact'
import { useState, useEffect } from 'preact/hooks'

import { CollectionList, CollectionListItem } from '@components/CollectionList'
import { CollectionSource } from '@scripts/source'

interface HomePageProps {
  isLoading: boolean
}

export const HomePage: Func<HomePageProps> = (props) => {
  const [collectionList, setCollectionList] = useState<CollectionListItem[]>([
    { text: 'Loading...', preview: 'n/a' },
  ])

  return (
    <div class="home">
      <CollectionList list={collectionList} />
    </div>
  )
}
