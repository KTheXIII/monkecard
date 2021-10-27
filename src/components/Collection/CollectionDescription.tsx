import React, {
  useRef,
  useEffect
} from 'react'
import { MemoMarkdown } from '@components/MemoMarkdown'
interface IProps {
  text: string
}

export const CollectionDescription: React.FC<IProps> = (props) => {
  return (
    <div className="memo-description pb-16">
      <div className="pb-4 text-mt-1">
        <span>description</span>
      </div>
      <MemoMarkdown markdown={props.text} className='flex flex-col space-y-3' />
    </div>
  )
}
