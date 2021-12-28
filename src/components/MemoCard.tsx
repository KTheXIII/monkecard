import React, {
  forwardRef,
  useCallback,
  useEffect, useImperativeHandle, useRef, useState
} from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { ToolsFloat, ToolsFloatButton } from '@components/ToolsFloat'
import { MemoFlipCard, MemoFlipCardRef } from './MemoItem/MemoFlipCard'
import { Memo } from '@models/item'

interface Props {
  memos: Memo[]
  onBack: () => void
}

export interface MemoCardRef {
  onKeyDown: (e: KeyboardEvent) => void
}

const Component = forwardRef<MemoCardRef, Props>((props, ref) => {
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
          icon={<BiChevronLeft />}
          isIconLeft={true} text="prev"
          onClick={onPrev}
        />
        <ToolsFloatButton
          text={`${activeCard + 1}/${memos.length}`}
        />
        <ToolsFloatButton
          icon={<BiChevronRight />}
          isIconLeft={false} text="next"
          onClick={onNext}
        />
      </ToolsFloat>
    </div>
  )
})

Component.displayName = 'MemoCard'
export const MemoCard = React.memo(Component)
