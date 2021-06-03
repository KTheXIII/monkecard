import React, { ReactElement } from 'react'

interface IFloatTool {
  title?: string
  icon: ReactElement
  text: string
  onClick?: () => void
}

export const FloatTool: React.FC<IFloatTool> = (props) => {
  return (
    <button
      title={props.title}
      onClick={props.onClick}>
      <div className="button-display">
        <div className="icon">{props.icon}</div>
        <div className="text">{props.text}</div>
      </div>
    </button>
  )
}

export const FloatToolsContainer: React.FC = (props) => {
  return (
    <div className="tools-float">
      <div className="tools">
        {props.children}
      </div>
    </div>
  )
}
