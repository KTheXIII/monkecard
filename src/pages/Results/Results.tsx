import React, {
  useState,
  useEffect,
  useCallback
} from 'react'
import {
  FileEarmarkCodeFill,
  CPU,
  ChevronRight
} from '@assets/icons'
import { IQuestion, ISession } from '@models/question.model'
import { IHistoryModel } from '@models/user.model'
import * as User from '@scripts/user'

import {
  FloatTool,
  FloatToolsContainer
} from '@components/ToolsFloat'
import { QuestionMulti } from '@components/Question'
import {
  CardContainer,
  CardComponent,
  CardElement
} from '@components/Card'

interface IResults {
  session: ISession
  onBack: () => void
}

// TODO: Add review mode to the questions when the session is over

export const Results: React.FC<IResults> = (props) => {
  const { session } = props
  const total = session.questions.length
  const [score, setScore] = useState(0)

  let correctList: number[] = []
  let incorrectList: number[] = []

  useEffect(() => {
    correctList = []
    incorrectList = []
    session.questions.forEach((question, index) => {
      let isCorrect = true
      for (const opt of question.options) {
        if (opt.correct !== opt.marked) {
          isCorrect = false
          break
        }
      }
      if (isCorrect) {
        correctList.push(index)
      } else {
        incorrectList.push(index)
      }
    })

    console.log(correctList)
    console.log(incorrectList)

    setScore(correctList.length)
  }, [session])

  return (
    <div className="results">
      <div className="score-display">
        <p>Result</p>
        {/* <p className="percent">
          {Math.floor((score.points / score.total) * 100)} %
        </p> */}
        <p>{score} / {total}</p>
      </div>

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
