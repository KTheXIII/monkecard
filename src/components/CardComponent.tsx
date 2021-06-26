import React, { ReactElement } from 'react'

export const CardContainer: React.FC = (props) => {
  return (
    <div className="card-list">
      {props.children}
    </div>
  )
}

interface ICardOptions {
  title: string
}

export const CardComponent: React.FC<ICardOptions> = (props) => {
  return (
    <div className="card">
      <div className="card-title">
        <span className="text">{props.title}</span>
      </div>
      <div className="card-content">
        {props.children}
      </div>
    </div>
  )
}

interface ICardElement {
  icon?: ReactElement
  text: string
  onClick: () => void
}

export const CardElement: React.FC<ICardElement> = (props) => {
  return (
    <button onClick={() => props.onClick()}>
      <div className="button-display">
        {props.icon && <div className="icon">{props.icon}</div>}
        <span className="text">{props.text}</span>
      </div>
    </button>
  )
}
