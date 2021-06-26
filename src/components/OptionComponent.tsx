import React, {
  useState,
  useEffect,
} from 'react'

import { Circle, CircleFill } from '../assets/icons'

import '../style/option.scss'

export const OptionContainer: React.FC = (props) => {
  return (
    <div className="options-container">
      <div className="option-list">
        {props.children}
      </div>
    </div>
  )
}

type TOnMark = (index: number, mark: boolean) => void

export interface IOptionBase {
  text: string
  isMarked: boolean
}

interface IOptionElement extends IOptionBase{
  onButtonClick: () => void
}

interface IMarkOption extends IOptionBase{
  index: number
  onMark: TOnMark
}

export const OptionElement: React.FC<IOptionElement> = (props) => {
  const { isMarked, text, onButtonClick } = props
  return (
    <button
      className="option-element"
      onClick={() => onButtonClick()}
    >
      <div className="button-display">
        <div className="icon">{isMarked ? CircleFill : Circle}</div>
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
