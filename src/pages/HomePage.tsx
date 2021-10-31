import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'

import { CollectionList } from '@components/Collection/CollectionList'
import { ICollectionSet } from '@models/dataset'
import { CollectionPage } from '@pages/CollectionPage'
import { EItemType, Item } from '@models/collection'
import { createItemFromSource } from '@scripts/collection'

enum EActive {
  Main,
  Collection,
}

interface Props {
  isLoading: boolean
  collections: ICollectionSet[]
  onReload: () => void
  onStart: (type: EItemType, items: Item[]) => void
}

export interface HomePageRef {
  onActive: () => void
}

export const HomePage = forwardRef<HomePageRef, Props>((props, ref) => {
  const { collections } = props
  const [active, setActive] = useState(EActive.Main)
  const [selectedSet, setSelectedSet] = useState<ICollectionSet | null>(null)

  useImperativeHandle(ref, () => ({
    onActive: () => {
      setActive(EActive.Main)
    },
  }))

  return (
    <div className="home p-4">
      {active === EActive.Main &&
       <CollectionList set={props.collections} onClick={index => {
         setSelectedSet(collections[index])
         setActive(EActive.Collection)
       }} />}
      {active === EActive.Collection && selectedSet && <CollectionPage
        set={selectedSet} onStart={(type, itemIDs) => {
          if (selectedSet) {
            const items = itemIDs.reduce((acc, id) => {
              // TODO: Compute hash with links to the source and item contents
              const item = selectedSet.collection.items.get(id)
              if (item) acc.push(createItemFromSource(item))
              return acc
            }, [] as Item[])
            // TODO: Set maximum number of items to play
            props.onStart(type, items)
          }
        }} />}

    </div>
  )
})
