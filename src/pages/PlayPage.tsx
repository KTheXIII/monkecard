import React, {} from 'react'
import {
  Item,
  IQuestion,
  Memo
} from '@models/collection'

interface PlayPageProps {
  items: Item[]
}

export const PlayPage: React.FC<PlayPageProps> = (props) => {
  return (
    <div className="play"></div>
  )
}
