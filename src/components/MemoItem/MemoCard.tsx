import { MemoMarkdown } from '@components/MemoMarkdown'
import React, {
  useState,
  useCallback
} from 'react'

import { Memo } from '@models/collection'

interface MemoCardProps {
  memo: Memo
  onFlip?: () => void
}

export const MemoCard: React.FC<MemoCardProps> = (props) => {
  const { memo, onFlip } = props
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(memo.front)

  const onClick = useCallback(() => {
    setShow(!show)
    if (show)
      setActive(memo.back)
    else
      setActive(memo.front)
    if (onFlip) onFlip()
  }, [show, onFlip, memo])

  return (
    <div className="memo-card grid cursor-pointer"
      onClick={onClick}>
      <div className="memo-card-content flex rounded overflow-x-scroll bg-mbg-1">
        <div className="memo-card-render m-auto px-8 py-4">
          <MemoMarkdown markdown={active} />
        </div>
      </div>
    </div>
  )
}
