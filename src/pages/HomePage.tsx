import React, {
  useState,
  useEffect,
  useMemo,
} from 'react'

import { IActivity } from '@models/user'
import { MonkeUser } from '@scripts/user'
import { MemoHeatmap } from '@components/MemoHeatmap'
import {
  REPOSITORY_URL,
  FORMATED_VERSION
} from '@scripts/env'
import { MemoList, MemoListButtonItem } from '@components/MemoList'
import { Command } from '@scripts/command'
import { TCommand } from '@models/command'
import {
  ECStatus, ICollection, ICollectionBase
} from '@models/collection'
import { MonkeCollection } from '@scripts/collection'

interface Props {
  isLoading: boolean
  user: MonkeUser
  collection: MonkeCollection
  command: Command<TCommand>
}

export const HomePage: React.FC<Props> = (props) => {
  const { isLoading, user, collection, command } = props
  const [collectionList, setCollectionList] = useState<ICollectionBase[]>([])
  const [heats, setHeats] = useState<IActivity[]>([])
  const colors = useMemo(() => {
    const base = getComputedStyle(document.body)
      .getPropertyValue('--activity-min').trim()
    const max = getComputedStyle(document.body)
      .getPropertyValue('--blue').trim()
    const colorBase = parseInt(base.slice(1), 16)
    const colorMax = parseInt(max.slice(1), 16)
    return [colorBase, colorMax] as [number, number]
  }, [])

  useEffect(() => {
    command.restore()
  }, [command])

  useEffect(() => {
    setCollectionList(collection.list())
    setHeats(user.getActivities())
  }, [isLoading, collection, user])

  return (
    <div className="home px-4 pt-4">
      <div className='mb-5 mt-5'>
        <h1 className='text-3xl text-mtext-dim-1'>
          {isLoading ? 'loading...' :  user.current().name}
        </h1>
      </div>
      <div className='pb-2 ml-1 text-mtext-dim-1'>activity</div>
      <MemoHeatmap heats={heats} colors={colors} />
      <div className='flex font-mono font-light text-sm mt-2'>
        <a
          title="Github repository link"
          className="text-mtext-dim-2 transition-colors ml-auto
                       duration-100x ease-in hover:text-mtext-hover"
          rel="noreferrer"
          target="_blank"
          href={REPOSITORY_URL}>
          {FORMATED_VERSION}
        </a>
      </div>
      <MemoList text='collections'>
        {collectionList.map((c, i) => {
          const text = c.status === ECStatus.Loaded ? (c as ICollection).title : c.source
          const preview = c.status === ECStatus.Loaded ? (c as ICollection).items.size : 'not loaded'
          return (
            <MemoListButtonItem key={i} text={text}
              preview={`${preview}`}
              onClick={() => {
                collection.select(i)
                // throw new Error('Selecting collection is not implemented yet')
              }} />
          )
        })}
      </MemoList>
    </div>
  )
}
