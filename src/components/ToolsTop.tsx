import React from 'react'

import { ChevronLeft, Clock } from '../assets/icons'

interface IToolsTop {
  backButton?: () => void
  time: number
}

export const ToolsTop: React.FC<IToolsTop> = (props) => {
  return (
    <div className="tools-top">
      <div className="left">
        <button className="back-button ">
          {ChevronLeft}
        </button>
      </div>
      <div className="timer center">
        <div className="clock-icon">
          {Clock}
        </div>
        <div className="time-display noselect">
          00:00:00
        </div>
      </div>
      <div className="right"></div>
    </div>
  )
}
