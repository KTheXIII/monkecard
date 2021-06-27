import React, { useState, useEffect } from 'react'
import { FileEarmarkCodeFill } from '../assets/icons'
import { IQSessionModel } from '../model/question'

import { FloatTool, FloatToolsContainer } from './ToolsFloatComponent'

import '../style/results.scss'

interface IResults {
  session: IQSessionModel
  onBack: () => void
}

interface IScore {
  points: number,
  total: number
}

export const Results: React.FC<IResults> = (props) => {
  const [score, setScore] = useState<IScore>({ points: 0, total: 0 })

  useEffect(() => {
    let correct = 0
    let total = 0
    props.session.questions.forEach((data) => {
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
