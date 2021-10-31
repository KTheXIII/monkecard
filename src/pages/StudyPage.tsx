import React, { useEffect, useState } from 'react'
import {
  EItemType,
  Memo
} from '@models/collection'
import { StudySession } from '@models/study'
import { MemoCard } from '@components/MemoCard'

interface Props {
  session: StudySession
  onHome: () => void
}

export const StudyPage: React.FC<Props> = (props) => {
  const { session } = props

  useEffect(() => {
    console.log(session)
  }, [session])

  return (
    <div className="p-4">
      {session.type === EItemType.Memo &&
       <MemoCard onBack={() => {
         props.onHome()
       }} memos={session.items as Memo[]} />}

      {session.type === EItemType.Question &&
      // TODO: Implement Question
      <div className="flex flex-col h-full">
        <h1 className="flex-grow h-80">feature not implemented</h1>
        <button onClick={() => props.onHome()}>go back</button>
      </div>}
    </div>
  )
}
