import { MemoMarkdown } from '@components/MemoMarkdown'
import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react'

import { Memo } from '@models/collection'

interface Props {
  memo: Memo
  onFlip?: () => void
}
export interface MemoFlipCardRef {
  flip: () => void
}

export const MemoFlipCard = forwardRef<MemoFlipCardRef, Props>((props, ref) => {
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
    <div className="memo-card grid cursor-pointer m-auto min-h-mcard min-w-mcard"
      onClick={onClick}>
      <div className="memo-card-content flex rounded-xl overflow-x-scroll bg-mbg-1">
        <div className="memo-card-render m-auto px-8 py-4">
          <MemoMarkdown markdown={active} />
        </div>
      </div>
    </div>
  )
})
