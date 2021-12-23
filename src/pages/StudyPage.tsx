import React, {
  forwardRef, useEffect, useImperativeHandle, useRef, useState
} from 'react'
import {
  EItemType,
  Memo
} from '@models/collection'
import { MemoCard, MemoCardRef } from '@components/MemoCard'
import { UserMonke } from '@scripts/user'
import { StudySession } from '@models/study'

interface Props {
  user: UserMonke
  onHome: () => void
}

export interface StudyPageRef {
  onKeyDown: (e: KeyboardEvent) => void
}

export const StudyPage = forwardRef<StudyPageRef, Props>((props, ref) => {
  const memoRef = useRef<MemoCardRef>(null)
  const { user } = props
  const [session, setSession] = useState<StudySession>()

  useImperativeHandle(ref, () => ({
    onKeyDown: (e: KeyboardEvent) => {
      memoRef.current?.onKeyDown(e)
    }
  }))

  useEffect(() => {
    setSession(user.getSession())
  }, [user])

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
      {session && session.type === EItemType.Memo &&
       <MemoCard
         ref={memoRef}
         onBack={() => {
           props.onHome()
         }} memos={session.items as Memo[]}
       />}
      {session && session.type === EItemType.Question &&
      // TODO: Implement Question
      <div className="flex flex-col h-full">
        <button onClick={() => props.onHome()}>go back</button>
      </div>}
    </div>
  )
})
