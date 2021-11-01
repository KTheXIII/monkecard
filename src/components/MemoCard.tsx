import React, {
  forwardRef,
  useCallback,
  useEffect, useImperativeHandle, useRef, useState
} from 'react'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import {
  ChevronLeft,
  ChevronRight,
} from '@assets/BootstrapIcons'
import { MemoFlipCard, MemoFlipCardRef } from './MemoItem/MemoFlipCard'
import { Memo } from '@models/collection'

interface Props {
  memos: Memo[]
  onBack: () => void
}

export interface MemoCardRef {
  onKeyDown: (e: KeyboardEvent) => void
}

export const MemoCard = forwardRef<MemoCardRef, Props>((props, ref) => {
  const { memos } = props
  const memoRef = useRef<MemoFlipCardRef>(null)
  const [activeCard, setActiveCard] = useState(0)
  const [memo, setMemo] = useState<Memo>()

  useImperativeHandle(ref, () => ({
    onKeyDown: (e) => {
      if (e.code === 'Space') memoRef.current?.flip()
      if (e.code === 'ArrowLeft') onPrev()
      if (e.code === 'ArrowRight') onNext()
      if (e.key === 'f') memoRef.current?.flip()
      if (e.key === 'n') onNext()
      if (e.key === 'N') onPrev()
    },
  }))

  useEffect(() => {
    if (memos && memos.length > 0)
      setMemo(memos[activeCard])
  }, [memos, activeCard])

  const onPrev = useCallback(() => {
    setActiveCard(prev => (prev + memos.length - 1) % memos.length)
  }, [memos])
  const onNext = useCallback(() => {
    setActiveCard(prev => (prev + 1) % memos.length)
  }, [memos])

  return (
    <div className="memo-card h-full grid p-4">
      {memo && <MemoFlipCard ref={memoRef} memo={memo} />}
      <ToolsFloat>
        <ToolsFloatButton
          icon={ChevronLeft}
          isIconLeft={true} text="prev"
          onClick={onPrev}
        />
        <ToolsFloatButton
          text={`${activeCard + 1}/${memos.length}`}
        />
        <ToolsFloatButton
          icon={ChevronRight}
          isIconLeft={false} text="next"
          onClick={onNext}
        />
      </ToolsFloat>
    </div>
  )
})
