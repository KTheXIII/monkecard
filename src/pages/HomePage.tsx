import React, {
  useState,
  useEffect
} from 'react'

import { CollectionList, CollectionListItem } from '@components/Collection/CollectionList'
import { ICollectionSet } from '@models/dataset'
import { CollectionPage } from '@pages/CollectionPage'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import { FileEarmarkCodeFill, MenuButtonWideFill } from '@assets/BootstrapIcons'
import { SettingsPage } from './SettingsPage'

enum EActive {
  Main,
  Collection,
  Settings
}

interface HomePageProps {
  isLoading: boolean
  collections: ICollectionSet[]
  onReload: () => void
}

export const HomePage: React.FC<HomePageProps> = (props) => {
  const { collections } = props
  const [collectionList, setCollectionList] = useState<CollectionListItem[]>([
    { text: 'Loading...', preview: 'error' },
  ])
  const [selectedSet, setSelectedSet] = useState<ICollectionSet | null>(null)
  const [active, setActive] = useState(EActive.Main)

  useEffect(() => {
    setCollectionList(collections.map(s => {
      if (s.collection) return {
        text: s.collection.title,
        preview: `${s.collection.items.size}`,
      }
      else return {
        text: s.sources.length != 0 ? s.sources[0].url : 'unknown',
        preview: 'error fetching',
      }
    }))
  }, [collections])

  return (
    <div className="home p-4">
      {active === EActive.Main &&
       <CollectionList list={collectionList} onClick={index => {
         setSelectedSet(collections[index])
         setActive(EActive.Collection)
       }} />}
      {active === EActive.Collection && selectedSet && <CollectionPage
        set={selectedSet} onStart={(items) => {
          console.log(items)
        }} />}
      {active === EActive.Settings && <SettingsPage
        collections={collections}
        onReload={props.onReload}
      />}
      <ToolsFloat>
        <ToolsFloatButton
          text="home"
          title="go to home page"
          icon={FileEarmarkCodeFill} onClick={() => {
            setActive(EActive.Main)
          }} />
        <ToolsFloatButton
          text="settings"
          title="go to settings page"
          icon={MenuButtonWideFill} onClick={() => {
            setActive(EActive.Settings)
          }} />
      </ToolsFloat>
    </div>
  )
}
