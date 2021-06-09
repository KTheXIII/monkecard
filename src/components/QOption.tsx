import React, { useState, ReactElement } from 'react'

import { Circle, CircleFill } from '../assets/icons'

export const QOptionContainer: React.FC = (props) => {
  return (
    <div className="q-options-container">
      <div className="q-options">
        {props.children}
      </div>
    </div>
  )
}

type TOnMark = (index: number, marked: boolean) => void

interface IQOption {
  text: string
  index: number
  onMark: TOnMark
}

export function QCreateOptions(options: string[],
  onMark: TOnMark): ReactElement[] {

  return options.map((value, index) => {
    return <QOption
      key={index}
      index={index}
      text={value}
      onMark={onMark}
    />
  })
}

export const QOption: React.FC<IQOption> = (props) => {
  const [isMarked, setMarked] = useState(false)

  return (
    <button
      className="q-option"
      onClick={() => {
        const marked = !isMarked
        setMarked(marked)
        props.onMark(props.index, marked)
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
