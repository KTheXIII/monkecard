import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'

import { Circle, CircleFill } from '../assets/icons'

import { IQOptionModel } from '../model/question'

export const QOptionContainer: React.FC = (props) => {
  return (
    <div className="q-options-container">
      <div className="q-options">
        {props.children}
      </div>
    </div>
  )
}

type TOnMark = (index: number, mark: boolean) => void

interface IQOption {
  text: string
  index: number
  isMarked: boolean
  onMark: TOnMark
}

export const QOption: React.FC<IQOption> = (props) => {
  const [isMarked, setIsMarked] = useState(false)

  useEffect(() => {
    setIsMarked(props.isMarked)
  }, [])

  return (
    <button
      className="q-option"
      onClick={() => {
        const mark = !isMarked
        setIsMarked(mark)
        props.onMark(props.index, mark)
      }}>
      <div className="button-display">
        <div className="icon">{isMarked ? CircleFill : Circle}</div>
        <div className="text">
          <span>{props.text}</span>
        </div>
      </div>
    </button>
  )
}
