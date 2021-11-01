import React, {
  forwardRef, useEffect, useImperativeHandle, useRef, useState
} from 'react'
import {
  EItemType,
  Memo
} from '@models/collection'
import { StudySession } from '@models/study'
import { MemoCard, MemoCardRef } from '@components/MemoCard'

interface Props {
  session: StudySession
  onHome: () => void
}

export interface StudyPageRef {
  onKeyDown: (e: KeyboardEvent) => void
}

export const StudyPage = forwardRef<StudyPageRef, Props>((props, ref) => {
  const memoRef = useRef<MemoCardRef>(null)
  const { session } = props

  useImperativeHandle(ref, () => ({
    onKeyDown: (e: KeyboardEvent) => {
      memoRef.current?.onKeyDown(e)
    }
  }))

  useEffect(() => {
    console.log(session)
  }, [session])

  return (
    <div className="h-full">
      <div className="fixed w-full text-black bg-mbg-0 h-12 px-4">
        <div className="flex w-full h-full text-mt-1">
          <button className="hover:text-mt-0 active:text-mt-1"
            onClick={() => props.onHome()}>
            home
          </button>
        </div>
      </div>
      {session.type === EItemType.Memo &&
       <MemoCard
         ref={memoRef}
         onBack={() => {
           props.onHome()
         }} memos={session.items as Memo[]}
       />}

      {session.type === EItemType.Question &&
      // TODO: Implement Question
      <div className="flex flex-col h-full">
        <button onClick={() => props.onHome()}>go back</button>
      </div>}
    </div>
  )
})
