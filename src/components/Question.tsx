import React, {
  ReactElement, useEffect, useState
} from 'react'

import { ToolsTop } from './ToolsTop'
import { ToolsFloat } from './ToolsFloat'

import '../style/question.scss'

const TIMER_UPDATE_DELAY = 1000

export const Question: React.FC = () => {
  const start = Date.now()
  const [currentTime, setCurrentTime] = useState(0)
  const [isFlagOn, setFlagOn] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - start)
    }, TIMER_UPDATE_DELAY)
    return () => {
      clearInterval(interval)
    }
  }, [])

  function onMark() {
    setFlagOn(!isFlagOn)
  }

  function onAnswered() {
    console.log('answered')
  }

  // FIXME: Remove this later
  const HelloElement: ReactElement[] = []
  for (let i = 0;i < 100;i++) {
    HelloElement.push(
      <p key={i}>Hello, World!</p>
    )
  }

  return (
    <div className="question">
      <ToolsTop time={currentTime} />
      <div className="display">
        {HelloElement}
      </div>
      <ToolsFloat isFlagOn={isFlagOn} onMark={onMark} onAnswered={onAnswered} />
    </div>
  )
}
