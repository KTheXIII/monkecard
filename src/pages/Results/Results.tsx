import React, { useState, useEffect } from 'react'
import { FileEarmarkCodeFill } from '@assets/icons'
import { ISession } from '@models/question.model'

import {
  FloatTool,
  FloatToolsContainer
} from '@components/ToolsFloat'

import './results.scss'

interface IResults {
  session: ISession
  onBack: () => void
}

interface IScore {
  points: number,
  total: number
}

export const Results: React.FC<IResults> = (props) => {
  const [score, setScore] = useState<IScore>({ points: 0, total: 0 })
  const { session } = props

  useEffect(() => {
    let correct = 0
    let total = 0
    session.questions.forEach((data) => {
      let questionPoint = 0
      data.options.forEach(opt => {
        if (opt.correct) total++
        if (opt.correct && opt.marked) questionPoint++
        else if (!opt.correct && opt.marked) questionPoint--
      })

      if (questionPoint > 0) correct += questionPoint
    })

    setScore({ points: correct, total })
  }, [])

  return (
    <div className="results">
      <div className="score-display">
        <h1>{score.points}/{score.total}</h1>
      </div>
      <div className="category-list"></div>
      <div className="details"></div>
      <div className="result-options"></div>

      <FloatToolsContainer>
        <FloatTool
          icon={FileEarmarkCodeFill}
          text="home"
          onButtonClick={props.onBack}
        />
      </FloatToolsContainer>
    </div>
  )
}
