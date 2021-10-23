import { MemoMarkdown } from '@components/MemoMarkdown'
import React, {
  useState,
  useRef,
  useCallback
} from 'react'

import { Memo } from '@models/collection'

interface MemoCardProps {
  memo: Memo
  onFlip?: () => void
}

export const MemoCard: React.FC<MemoCardProps> = (props) => {
  const memo = props.memo
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(memo.front)

  const onFlip = useCallback(() => {
    setShow(!show)
    if (show) {
      setActive(memo.back)
    } else {
      setActive(memo.front)
    }
    if (props.onFlip) props.onFlip()
  }, [show, props])

  return (
    <div className="memo-card" onClick={() => onFlip()}>
      <div className="memo-card-content">
        <div className="memo-card-render">
          <MemoMarkdown markdown={active} />
        </div>
      </div>
    </div>
  )
}
