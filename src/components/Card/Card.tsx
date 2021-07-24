import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'

import { Circle, CircleFill } from '@assets/icons'

export const CardContainer: React.FC = (props) => {
  return (
    <div className="card-list">
      {props.children}
    </div>
  )
}

interface ICardOptions {
  title?: string
}

export const CardComponent: React.FC<ICardOptions> = (props) => {
  const { title, children } = props
  return (
    <div className="card">
      {title &&
        <div className="card-title">
          <span className="text">{title}</span>
        </div>
      }
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

interface ICardElement {
  icon?: ReactElement
  isLast?: boolean
  text: string
  isEnable?: boolean
  onButtonClick: () => void
}

export const CardElement: React.FC<ICardElement> = (props) => {
  const { icon, text } = props
  const isLast = props.isLast !== undefined ? props.isLast : true
  const isDisabled = props.isEnable !== undefined ? !props.isEnable : false

  return (
    <button
      disabled={isDisabled}
      className={(isLast ? 'is-last ' : '') + 'default'}
      onClick={() => props.onButtonClick()}>
      <div className="button-display">
        {icon && <div className="icon">{icon}</div>}
        <span className="text">{text}</span>
      </div>
    </button>
  )
}

interface ICardMarkElement {
  icons?: [ReactElement, ReactElement]
  text: string
  page?: number
  index: number
  isLast?: boolean
  isMarked: boolean
  onMark: (mark: boolean) => void
}

export const CardMarkElement: React.FC<ICardMarkElement> = (props) => {
  const { onMark } = props
  const [isMarked, setIsMarked] = useState(false)
  const [OFF, ON] = props.icons || [Circle, CircleFill]
  useEffect(() => setIsMarked(props.isMarked), [])

  return (
    <CardElement
      onButtonClick={() => {
        const mark = !isMarked
        setIsMarked(mark)
        onMark(mark)
      }}
      text={props.text}
      icon={isMarked ? ON : OFF}
      isLast={props.isLast || false}
    />
  )
}
