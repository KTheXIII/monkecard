import React, { ReactElement } from 'react'

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
  text: string
  onButtonClick: () => void
}

export const CardElement: React.FC<ICardElement> = (props) => {
  return (
    <button onClick={() => props.onButtonClick()}>
      <div className="button-display">
        {props.icon && <div className="icon">{props.icon}</div>}
        <span className="text">{props.text}</span>
      </div>
    </button>
  )
}
