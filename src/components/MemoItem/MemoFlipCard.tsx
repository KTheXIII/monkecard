import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react'

import { MemoMarkdown } from '@components/MemoMarkdown'
import { Memo } from '@models/item'

interface Props {
  memo: Memo
  onFlip?: () => void
}
export interface MemoFlipCardRef {
  flip: () => void
}

const Component = forwardRef<MemoFlipCardRef, Props>((props, ref) => {
  const { memo, onFlip } = props
  const [show, setShow]  = useState(false)
  const [active, setActive] = useState(memo.front)

  useImperativeHandle(ref, () => ({
    flip: flipCard
  }))

  const flipCard = useCallback(() => {
    setShow(!show)
  }, [show])

  const onClick = useCallback(() => {
    flipCard()
    if (onFlip) onFlip()
  }, [flipCard, onFlip])

  useEffect(() => {
    setShow(false)
  }, [props])

  useEffect(() => {
    const { memo } = props
    if (show)
      setActive(memo.back)
    else
      setActive(memo.front)
  }, [props, show])

  return (
    <div className="memo-card grid cursor-pointer pb-28"
      onClick={onClick}>
      <div className="m-auto">
        <MemoMarkdown markdown={active} />
      </div>
    </div>
  )
})

Component.displayName = 'MemoFlipCard'
export const MemoFlipCard = Component
