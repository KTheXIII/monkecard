import React, {
  useRef,
  useEffect
} from 'react'
import { MemoMarkedown } from '@components/MemoMarkedown'
interface IProps {
  text: string
}

export const CollectionDescription: React.FC<IProps> = (props) => {
  return (
    <div className="memo-description pb-16">
      <div className="pb-4">
        <span>description</span>
      </div>
      <MemoMarkedown markdown={props.text} className='flex flex-col space-y-3' />
    </div>
  )
}
