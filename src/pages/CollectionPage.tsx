import React, {
  useEffect,
  useState
} from 'react'

import { CollectionDescription } from '@components/Collection/CollectionDescription'
import { ICollectionSet } from '@models/dataset'
import { CollectionItemList } from '@components/Collection/CollectionItemList'
import { Item } from '@models/collection'

interface CollectionPageProps {
  set: ICollectionSet
  onStart: (item: Item[]) => void
}

const ActionButton: React.FC<{
  text: string,
  onClick?: () => void
}> = (props) => {
  return (
    <button className={`text-mt-1 h-7 rounded-me px-4 py-1
    transition-colors duration-150 ease-out hover:text-mt-0
    active:text-mt-2
    `}
    onClick={() => props.onClick && props.onClick()}>
      {props.text}
    </button>
  )
}

export const CollectionPage: React.FC<CollectionPageProps> = (props) => {
  const { collection } = props.set
  const { title, description, items } = collection
  const [selected, setSelected] = useState<string[]>([])
  const [startText, setStartText] = useState('start')

  return (
    <div className="collection-page pb-40">
      <div className="collection-header pb-10">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <CollectionDescription text={description} />
      <div className="flex flex-row-reverse mb-3 gap-1">
        <ActionButton text={startText} onClick={() => {
          const idSet = new Set<string>()
          if (selected.length > 0) selected.forEach(keyword => {
            Array.from(items.values())
              .filter(item => item.keywords.includes(keyword))
              .forEach(item => idSet.add(item.id))
          })
          else Array.from(items.values())
            .forEach(item => idSet.add(item.id))

          console.log(idSet)
        }} />
        {selected.length > 0 && <ActionButton text={'clear'}
          onClick={() => {
            console.log('clear')
          }} />}
      </div>
      <CollectionItemList
        items={items}
        onSelect={(keys) => {
          setSelected(keys)
          if (keys.length > 0) setStartText('start selected')
          else setStartText('start')
        }} />
    </div>
  )
}
