import React, { useState } from 'react'

import {
  Files,
  Flag,
  FlagFill
} from '../assets/icons'

import '../style/toolsfloat.scss'

interface IToolsFloat {
  onAnswered: () => void
  onMark: () => void
  isFlagOn: boolean
}

export const ToolsFloat: React.FC<IToolsFloat> = (props) => {
  return (
    <div className="tools-floating noselect">
      <div className="tools">
        <button
          className="answered"
          onClick={props.onAnswered}
        >
          <div className="button-display">
            <div className="icon">{Files}</div>
            <span className="text">answered</span>
          </div>
        </button>
        <button
          className="mark"
          onClick={props.onMark}
        >
          <div className="button-display">
            <div className="icon">{props.isFlagOn ? FlagFill : Flag}</div>
            <span className="text">mark</span>
          </div>
        </button>
      </div>
    </div>
  )
}
