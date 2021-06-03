import React, { useState } from 'react'

import { ChevronLeft, Stopwatch } from '../assets/icons'

import '../style/toolstop.scss'

interface IToolsTop {
  backButton?: () => void
  time: number
}

function formatTimer(time: number) {
  return new Date(time).toLocaleTimeString('en-SE', { timeZone: 'utc' })
}

export const ToolsTop: React.FC<IToolsTop> = (props) => {
  return (
    <div className="tools-top">
      <div className="left">
        <button
          className="back-button"
          onClick={props.backButton}
        >
          {ChevronLeft}
        </button>
      </div>
      <div className="timer center">
        <div className="clock-icon">
          {Stopwatch}
        </div>
        <div className="time-display noselect">
          {formatTimer(props.time)}
        </div>
      </div>
      <div className="right"></div>
    </div>
  )
}
