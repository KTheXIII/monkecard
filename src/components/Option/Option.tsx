import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'

import { Circle, CircleFill } from '@assets/icons'

export const OptionContainer: React.FC = (props) => {
  return (
    <div className="options-container">
      <div className="option-list">
        {props.children}
      </div>
    </div>
  )
}

interface IOptionBase {
  text: string
  isMarked: boolean
  icons?: [ReactElement, ReactElement]
}

interface IOption {
  text: string
  icon?: ReactElement
  onButton?: () => void
  css?: string
  disabled?: boolean
}

export const Option: React.FC<IOption> = (props) => {
  const { icon, onButton } = props
  const css = props.css || ''
  const disabled = props.disabled !== undefined ? props.disabled : false

  const text = props.text
    .split('\n')
    .map((line, i) => <span key={i}>{line}</span>)

  return (
    <button
      disabled={disabled}
      className={'option-element' + ` ${css}`}
      onClick={() => {
        if (onButton) onButton()
      }}>
      <div className="button-display">
        {icon && <div className="icon">{icon}</div>}
        <div className="text">
          {text}
        </div>
      </div>
    </button>
  )
}

interface IOptionElement extends IOptionBase{
  onButton: () => void
}

export const OptionElement: React.FC<IOptionElement> = (props) => {
  const { isMarked, onButton: onButtonClick } = props
  const [OFF, ON] = props.icons || [Circle, CircleFill]

  return (
    <Option
      text={props.text}
      onButton={onButtonClick}
      icon={isMarked ? ON : OFF}
    />
  )
}

type TOnMark = (index: number, mark: boolean) => void

interface IMarkOption extends IOptionBase{
  index: number
  onMark: TOnMark
}

export const OptionMarkElement: React.FC<IMarkOption> = (props) => {
  const [isMarked, setIsMarked] = useState(false)
  useEffect(() => setIsMarked(props.isMarked), [])

  return (
    <OptionElement
      onButton={() => {
        const mark = !isMarked
        setIsMarked(mark)
        props.onMark(props.index, mark)
      }}
      text={props.text}
      isMarked={isMarked}
    />
  )
}
