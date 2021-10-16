import React, {
  useRef,
  useEffect
} from 'react'
import './collection-description.scss'
import { MemoMarkedown } from '@components/MemoMarkedown'
interface IProps {
  text: string
}

export const CollectionDescription: React.FC<IProps> = (props) => {
  return (
    <div className="collection-description">
      <div className="description-info">
        <span>description</span>
      </div>
      <div className="description-text">
        <MemoMarkedown markdown={props.text} />
      </div>
    </div>
  )
}
