import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'

import { MemoMarkdown } from '@components/MemoMarkdown'
import { Memo } from '@models/Card'

interface Props {
  memo: Memo
  onGrade: (grade: number) => void
}
export interface MemoFlipCardRef {
  flip: () => void
}

const Button: React.FC<{text: string, onClick: () => void}> = ({ text, onClick }) => {
  return (
    <button className='px-6 py-2 border-r border-mbg-base last:border-0 bg-mbg-1 hover:bg-mbg-2'
      onClick={() => onClick()}>
      {text}
    </button>
  )
}

const FloatBottom: React.FC = ({ children }) => {
  return (
    <div className='fixed left-1/2 -translate-x-1/2 bottom-0 mb-8 flex rounded-lg overflow-hidden shadow-memo'>
      {children}
    </div>
  )
}

const MAX_GRADE = 3
const GradeComponent: React.FC<{onGrade: (grade: number) => void}> = (props) => {
  return (
    <FloatBottom>
      <Button text='again' onClick={() => props.onGrade(0)} />
      <Button text='hard' onClick={() => props.onGrade(1)} />
      <Button text='good' onClick={() => props.onGrade(2)} />
      <Button text='easy' onClick={() => props.onGrade(3)} />
    </FloatBottom>
  )
}

const Component = forwardRef<MemoFlipCardRef, Props>((props, ref) => {
  const { memo, onGrade } = props
  const [show, setShow]  = useState(false)

  useImperativeHandle(ref, () => ({
    flip: flipCard
  }))

  const flipCard = useCallback(() => {
    setShow(!show)
  }, [show])

  useEffect(() => {
    setShow(false)
  }, [props])

  return (
    <div className='memo-card pb-20'>
      <div className={`h-full w-full grid grid-rows-2 p-3 ${show ? '' : 'cursor-pointer'}`}
        onClick={() => {
          setShow(true)
        }}>
        <div className='border-b grid border-mbg-3'>
          <div className='m-auto'>
            <MemoMarkdown markdown={memo.front} />
          </div>
        </div>
        <div className='grid w-full overflow-auto'>
          <div className='m-auto'>
            {show && <MemoMarkdown markdown={memo.back} />}
          </div>
        </div>
      </div>

      {show && <GradeComponent onGrade={(grade) => {
        onGrade(grade / MAX_GRADE)
      }} />}
      {!show && <FloatBottom>
        <Button text='show' onClick={flipCard} />
      </FloatBottom>}
    </div>
  )
})

Component.displayName = 'MemoFlipCard'
export const MemoFlipCard = Component
