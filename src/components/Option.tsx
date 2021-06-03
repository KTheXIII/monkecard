import React, { useState } from 'react'

import { Circle, CircleFill } from '../assets/icons'

export const OptionContainer: React.FC = (props) => {
  return (
    <div className="options-container">
      {props.children}
    </div>
  )
}

interface IOption {
  text: string
  onMark: (marked: boolean) => void
}

export const Option: React.FC<IOption> = (props) => {
  const [isMarked, setMarked] = useState(false)

  return (
    <div
      className="option"
      onClick={() => {
        const marked = !isMarked
        setMarked(marked)
        props.onMark(marked)
      }}>
      <div className="icon">{isMarked ? CircleFill : Circle}</div>
      <div className="text">
        <span>{props.text}</span>
      </div>
    </div>
  )
}
