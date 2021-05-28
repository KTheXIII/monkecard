import React, { useEffect, useState } from 'react'

import { ToolsTop } from './ToolsTop'

import '../style/question.scss'

export const Question: React.FC = () => {
  const [time, setTime] = useState(0)

  return (
    <div className="question">
      <ToolsTop time={0} />
      <div className="display"></div>
      <div className="tools-floating">
        <div className="answered"></div>
        <div className="mark"></div>
      </div>
    </div>
  )
}
