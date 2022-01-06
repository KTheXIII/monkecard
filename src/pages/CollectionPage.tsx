import React, {
  useEffect,
  useState,
} from 'react'
import sha256 from 'crypto-js/sha256'
import {
  ECStatus,
  ECType,
  ICollection,
  ICollectionBase
} from '@models/collection'
import { Item } from '@models/item'
import { MonkeCollection } from '@scripts/collection'
import { MonkeUser } from '@scripts/user'
import { CollectionItemList } from '@components/CollectionItemList'
import { Command } from '@scripts/command'
import { MonkeSession } from '@scripts/session'
import { TCommand } from '@models/command'
import { Subscription } from 'rxjs'

interface Props {
  isLoading: boolean
  user: MonkeUser
  collection: MonkeCollection
  session: MonkeSession
  command: Command<TCommand>
}

export const CollectionPage: React.FC<Props> = (props) => {
  const { isLoading, collection, command, session } = props
  const [data, setData] = useState<ICollectionBase>()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string>()
  const [items, setItems] = useState<Map<string, Item>>()

  useEffect(() => {
    const subs: Subscription[] = []
    subs.push(collection.subSelect(c => {
      const selected = collection.getSelect()
      if (selected) setData(selected)
    }))
    subs.push(collection.subLoading(isloading => {
      if (isloading) {
        setData(undefined)
        return
      }
      const selected = collection.getSelect()
      if (selected) setData(selected)
    }))
    return () => subs.forEach(s => s.unsubscribe())
  }, [collection, command])

  useEffect(() => {
    const selected = collection.getSelect()
    if (selected) setData(selected)
    else setData(undefined)

    command.nextExtend([
      [`start current`, async () => {
        // TODO: start current selected collection
      }],
    ])

    return () => {
      command.resetExtend()
    }
  }, [isLoading, collection, command])

  // TODO: Render something else when loading
  // TODO: Render something else when error
  useEffect(() => {
    if (!data) return
    if (data.status === ECStatus.Error) {
      setTitle('Error')
      setDescription(`${data.error}`)
    } else if (data.status === ECStatus.Loaded) {
      const c = data as ICollection
      setTitle(c.title)
      setDescription(c.description)
      setItems(c.items)
    }
  }, [data])

  return (
    <div className='pb-28 p-4'>
      <div>
        <h1>{title}</h1>
      </div>
      <div>{description}</div>
      {data && data.status !== ECStatus.Error
      && <CollectionItemList items={items} onStart={(type, ids) => {
        if (data.status === ECStatus.Error || data.status === ECStatus.NotLoaded)
          return
        const c = data as ICollection
        session.create(c, type, ids)
      }} />}
    </div>
  )
}
