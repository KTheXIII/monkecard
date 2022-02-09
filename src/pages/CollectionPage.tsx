import React, {
  useEffect,
  useState,
} from 'react'
import sha256 from 'crypto-js/sha256'
import {
  EDeckStatus,
  EDeckType,
  IDeck,
  IDeckBase
} from '@models/Deck'
import { Card } from '@models/Card'
import { CollectionItemList } from '@components/CollectionItemList'
import { Command } from '@scripts/command'
import { TCommand } from '@models/command'
import { Subscription } from 'rxjs'

interface Props {
  isLoading: boolean
  command: Command<TCommand>
}

export const CollectionPage: React.FC<Props> = (props) => {
  return (
    <div className='pb-28 p-4'>
    </div>
  )
}
