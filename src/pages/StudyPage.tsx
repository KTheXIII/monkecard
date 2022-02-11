import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { MemoCard, MemoCardRef } from '@components/MemoCard'
import { Memo, ECardType } from '@models/Card'

interface Props {
  onHome: () => void
}

export interface StudyPageRef {
  onKeyDown: (e: KeyboardEvent) => void
}

export const StudyPage = forwardRef<StudyPageRef, Props>((props, ref) => {
  const memoRef = useRef<MemoCardRef>(null)

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
