import React, { useState, useEffect } from 'react'

import {
  Bookmark,
  BookmarkCheckFill,
  ChevronLeft,
  Stopwatch
} from '@assets/icons'
import { ToolsTop } from '@components/ToolsTop'

interface IToolTimerTop {
  onBack: () => void
  onBookmark: (isMarked: boolean) => void
  isBookmarked: boolean
  time: number
}

function formatTimer(time: number) {
  return new Date(time).toLocaleTimeString('en-SE', { timeZone: 'utc' })
}

export const ToolsTimerTop: React.FC<IToolTimerTop> = (props) => {
  const { isBookmarked, time } = props
  const [isMarked, setIsMarked] = useState(false)

  useEffect(() => {
    setIsMarked(isBookmarked)
  }, [])

  return (
    <ToolsTop>
      <div className="tool-timer-top">
        <div className="left">
          <button
            className="back-button"
            onClick={() => props.onBack()}>
            {ChevronLeft}
          </button>
        </div>
        <div className="timer center">
          <div className="clock-icon">
            {Stopwatch}
          </div>
          <div className="time-display noselect">
            {formatTimer(time)}
          </div>
        </div>
        <div className="right">
          <button
            className="bookmark-button"
            onClick={() => {
            // TODO: Implement the callback for Question page
              setIsMarked(!isMarked)
            }}>
            {isMarked ? BookmarkCheckFill : Bookmark}
          </button>
        </div>
      </div>
    </ToolsTop>
  )
}
