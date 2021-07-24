import React, { ReactElement } from 'react'

interface IFloatTool {
  title?: string
  icon: ReactElement
  text: string
  onButtonClick?: () => void
  isRight?: boolean  // Icon on the right of the text
}

export const FloatTool: React.FC<IFloatTool> = (props) => {
  const isRight = props.isRight || false
  return (
    <button
      className={`${isRight ? 'pad-left' : 'pad-right'}`}
      title={props.title}
      onClick={props.onButtonClick}>
      <div className="button-display">
        {!isRight && <div className="icon">{props.icon}</div>}
        <div className="text">{props.text}</div>
        {isRight && <div className="icon">{props.icon}</div>}
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
