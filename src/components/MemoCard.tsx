import React, {
  useCallback,
  useEffect, useRef, useState
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

export const MemoCard: React.FC<Props> = (props) => {
  const { memos } = props
  const memoRef = useRef<MemoFlipCardRef>(null)
  const [activeCard, setActiveCard] = useState(0)
  const [memo, setMemo] = useState<Memo>()

  useEffect(() => {
    if (!memos) return
    if (memos.length > 0) {
      setMemo(memos[activeCard])
    }
  }, [memos, activeCard])

  const onPrev = useCallback(() => {
    setActiveCard(prev => (prev + memos.length - 1) % memos.length)
  }, [memos])
  const onNext = useCallback(() => {
    const next = (activeCard + 1) % memos.length
    setActiveCard(next)
    console.log(next)

  }, [memos, activeCard])

  return (
    <div>
      {memo && <MemoFlipCard ref={memoRef} memo={memo} />}
      <ToolsFloat>
        <ToolsFloatButton
          icon={ChevronLeft}
          isIconLeft={true} text="prev"
          onClick={onPrev}
        />
        <ToolsFloatButton
          text="home"
          onClick={() => {
            props.onBack()
          }}
        />
        <ToolsFloatButton
          icon={ChevronRight}
          isIconLeft={false} text="next"
          onClick={onNext}
        />
      </ToolsFloat>
    </div>
  )
}
