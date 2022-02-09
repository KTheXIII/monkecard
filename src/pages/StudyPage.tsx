import React, {
  forwardRef, useEffect, useImperativeHandle, useRef, useState
} from 'react'
import { MemoCard, MemoCardRef } from '@components/MemoCard'
import { ISession } from '@models/session'
import { Memo, ECardType } from '@models/Card'
import { Command } from '@scripts/command'
import { TCommand } from '@models/command'

interface Props {
  command: Command<TCommand>
  onHome: () => void
}

export interface StudyPageRef {
  onKeyDown: (e: KeyboardEvent) => void
}

export const StudyPage = forwardRef<StudyPageRef, Props>((props, ref) => {
  const memoRef = useRef<MemoCardRef>(null)
  const { command  } = props
  const [current, setCurrent] = useState<ISession>()

  useImperativeHandle(ref, () => ({
    onKeyDown: (e: KeyboardEvent) => {
      memoRef.current?.onKeyDown(e)
    }
  }))

  return (
    <div className="h-full">
    </div>
  )
})
