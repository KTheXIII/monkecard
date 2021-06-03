import React, { useState } from 'react'

import {
  Files,
  Flag,
  FlagFill,
  ChevronRight
} from '../assets/icons'

import '../style/toolsfloat.scss'

interface IToolsFloat {
  onAnswered: () => void
  onMark: () => void
  onNext: () => void
  isFlagOn: boolean
}

export const ToolsFloat: React.FC<IToolsFloat> = (props) => {
  return (
    <div className="tools-floating noselect">
      <div className="tools">
        <button
          onClick={props.onAnswered}
        >
          <div className="button-display">
            <div className="icon">{Files}</div>
            <span className="text">answered</span>
          </div>
        </button>
        <button
          onClick={props.onMark}
        >
          <div className="button-display">
            <div className="icon">{props.isFlagOn ? FlagFill : Flag}</div>
            <span className="text">mark</span>
          </div>
        </button>
        <button
          className="right"
          onClick={props.onNext}
        >
          <div className="button-display">
            <div className="icon">{ChevronRight}</div>
            <span className="text">next</span>
          </div>
        </button>
      </div>
    </div>
  )
}
