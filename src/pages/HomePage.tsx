import React, {
  useState,
  useEffect,
  useMemo,
  ReactElement,
} from 'react'

import { CollectionList } from '@components/Collection/CollectionList'
import { ICollectionSet } from '@models/dataset'
import { IActivity, TimeData } from '@models/user'
import { Monke } from '@scripts/monke'
import { UserMonke } from '@scripts/user'
import { MemoHeatmap } from '@components/MemoHeatmap'
import {
  REPOSITORY_URL,
  FORMATED_VERSION
} from '@scripts/env'
import { MemoList, MemoListButtonItem } from '@components/MemoList'

interface Props {
  isLoading: boolean
  monke: Monke
  user: UserMonke
}

export const HomePage: React.FC<Props> = (props) => {
  const { monke, isLoading, user } = props
  const [collections, setCollections] = useState<ICollectionSet[]>([])
  const colors = useMemo(() => {
    const base = getComputedStyle(document.body)
      .getPropertyValue('--activity-min').trim()
    const max = getComputedStyle(document.body)
      .getPropertyValue('--blue').trim()
    const colorBase = parseInt(base.slice(1), 16)
    const colorMax = parseInt(max.slice(1), 16)
    return [colorBase, colorMax] as [number, number]
  }, [])

  // TODO: Generate heatmap from user's activity
  const heats = useMemo(() => {
    const today = new Date(new Date().toLocaleDateString('en-SE'))
    const day = 24 * 60 * 60 * 1000

    if (isLoading) return Array(365).fill(0).map((_, i) => {
      return {
        active: 0,
        count: 0,
        date: new Date(today.getTime() - i * day),
      } as IActivity
    })

    const current = user.getUser()
    const visits = current.metrics.visits
    const dataPoints = visits.reduce((acc, cur) => {
      const date = new Date(cur)
      const justDate = new Date(date.getFullYear(),
        date.getMonth(), date.getDate())

      if (acc.length === 0) {
        acc.push({
          time: justDate.getTime(),
          data: 1
        })
      }
      const last = acc[acc.length - 1]
      if (last.time === justDate.getTime()) {
        last.data += 1
        return acc
      } else {
        acc.push({
          time: justDate.getTime(),
          data: 1
        })
      }
      return acc
    }, [] as TimeData<number>[])
    const largest = Math.max(...dataPoints.map(d => d.data))

    const len = 365 - dataPoints.length > 0 ? 365 - dataPoints.length : 0
    return dataPoints.concat(Array(len).fill({ time: 0, data: 0 }))
      .map((d, i) => ({
        time: d.time > 0 ? d.time : today.getTime() - (i * day),
        data: d.data
      } as TimeData<number>))
      .map(d => ({
               // active: Math.random() * (Math.random() > 0.1 ? 1 : 0),
        active: d.data / largest,
        count: d.data,
        date: new Date(d.time),
      } as IActivity)).reverse()
  }, [user, isLoading])

  useEffect(() => {
    setCollections(monke.getCollections())
  }, [monke, isLoading])

  return (
    <div className="home px-4 pt-4">
      <div className='mb-5 mt-5'>
        <h1 className='text-3xl text-mtext-dim-1'>
          {user.getUser().name}
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
        {collections.map((c, i) => (
          <MemoListButtonItem key={i} text={c.collection.title}
            preview={`${c.collection.items.size}`}
            onClick={() => {
              monke.subjectCollection.next(i)
            }} />
        ))}
      </MemoList>
    </div>
  )
}
