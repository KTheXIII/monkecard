import React, { ReactElement } from 'react'

export const CardOptionList: React.FC = (props) => {
  return (
    <div className="card-list">
      {props.children}
    </div>
  )
}

interface ICardOptions {
  title: string
}

export const CardOptions: React.FC<ICardOptions> = (props) => {
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

interface ICardOption {
  icon?: ReactElement
  text: string
  onClick: () => void
}

export const CardOption: React.FC<ICardOption> = (props) => {
  return (
    <button onClick={props.onClick}>
      <div className="button-display">
        {props.icon && <div className="icon">{props.icon}</div>}
        <span className="text">{props.text}</span>
      </div>
    </button>
  )
}
