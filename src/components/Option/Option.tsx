import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'

import { Circle, CircleFill } from '@assets/icons'

import './option.scss'

export const OptionContainer: React.FC = (props) => {
  return (
    <div className="options-container">
      <div className="option-list">
        {props.children}
      </div>
    </div>
  )
}

export interface IOptionBase {
  text: string
  isMarked: boolean
  icons?: [ReactElement, ReactElement]
}

interface IOptionElement extends IOptionBase{
  onButtonClick: () => void
}

type TOnMark = (index: number, mark: boolean) => void

interface IMarkOption extends IOptionBase{
  index: number
  onMark: TOnMark
}

export const OptionElement: React.FC<IOptionElement> = (props) => {
  const { isMarked, text, onButtonClick } = props
  const [OFF, ON] = props.icons || [Circle, CircleFill]
  return (
    <button
      className="option-element"
      onClick={() => onButtonClick()}
    >
      <div className="button-display">
        <div className="icon">{isMarked ? ON : OFF}</div>
        <div className="text">
          <span>{text}</span>
        </div>
      </div>
    </button>
  )
}

export const OptionMarkElement: React.FC<IMarkOption> = (props) => {
  const [isMarked, setIsMarked] = useState(false)
  useEffect(() => setIsMarked(props.isMarked), [])

  return (
    <OptionElement
      onButtonClick={() => {
        const mark = !isMarked
        setIsMarked(mark)
        props.onMark(props.index, mark)
      }}
      text={props.text}
      isMarked={isMarked}
    />
  )
}
