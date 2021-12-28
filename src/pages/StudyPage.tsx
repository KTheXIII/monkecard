import React, {
  forwardRef, useEffect, useImperativeHandle, useRef, useState
} from 'react'
import { MemoCard, MemoCardRef } from '@components/MemoCard'
import { MonkeUser } from '@scripts/user'
import { ISession } from '@models/session'
import { Memo, EItemType } from '@models/item'
import { Command } from '@scripts/command'
import { TCommand } from '@models/command'
import { MonkeSession } from '@scripts/session'

interface Props {
  user: MonkeUser
  session: MonkeSession
  command: Command<TCommand>
  onHome: () => void
}

export interface StudyPageRef {
  onKeyDown: (e: KeyboardEvent) => void
}

export const StudyPage = forwardRef<StudyPageRef, Props>((props, ref) => {
  const memoRef = useRef<MemoCardRef>(null)
  const { user, command, session } = props
  const [current, setCurrent] = useState<ISession>()

  useImperativeHandle(ref, () => ({
    onKeyDown: (e: KeyboardEvent) => {
      memoRef.current?.onKeyDown(e)
    }
  }))

  useEffect(() => {
    setCurrent(session.current())
  }, [user, command, session])

  return (
    <div className="h-full">
      <div className="fixed w-full bg-mbg-0 h-12 px-4">
        <div className="flex w-full h-full text-mt-1">
          <button className="hover:text-mt-0 active:text-mt-1"
            onClick={() => props.onHome()}>
            home
          </button>
        </div>
      </div>
      {current && current.type === EItemType.Memo &&
       <MemoCard
         ref={memoRef}
         onBack={() => {
           props.onHome()
         }} memos={current.items as Memo[]}
       />}
      {current && current.type === EItemType.Question &&
      // TODO: Implement Question
      <div className="flex flex-col h-full">
        <button onClick={() => props.onHome()}>go back</button>
      </div>}
    </div>
  )
})
