import { MemoMarkedown } from '@components/MemoMarkedown'
import React, {
  useState,
  useRef,
  useCallback
} from 'react'

interface MemoCardProps {
  front: string
  back: string
  onFlip?: () => void
}

export const MemoCard: React.FC<MemoCardProps> = (props) => {
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(props.front)

  const onFlip = useCallback(() => {
    setShow(!show)
    if (show) {
      setActive(props.back)
    } else {
      setActive(props.front)
    }

    if (props.onFlip) props.onFlip()
  }, [show, props])

  return (
    <div className="memo-card" onClick={() => onFlip()}>
      <div className="memo-card-content">
        <div className="memo-card-info">
        </div>
        <div className="memo-card-render">
          <MemoMarkedown markdown={active} />
        </div>
      </div>
    </div>
  )
}
