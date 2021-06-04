import React, { useState } from 'react'

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

interface IQOption {
  text: string
  onMark: (marked: boolean) => void
}

export const QOption: React.FC<IQOption> = (props) => {
  const [isMarked, setMarked] = useState(false)

  return (
    <button
      className="q-option"
      onClick={() => {
        const marked = !isMarked
        setMarked(marked)
        props.onMark(marked)
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
