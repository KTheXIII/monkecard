import React, {
  useState,
  useEffect,
  useCallback
} from 'react'

import {
  FileEarmarkCodeFill,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from '@assets/icons'
import {
  FloatTool,
  FloatToolsContainer
} from '@components/ToolsFloat'
import {
  ListComponent,
  ListItemButton
} from '@components/List'
import { Review } from '@components/Review'
import { ToolsTop } from '@components/ToolsTop'

import { IQuestion, ISession } from '@models/question.model'
import * as Timer from '@scripts/timer'
import { IUser } from '@models/user.model'

interface IResults {
  session: ISession
  user: IUser
  onSave: () => void
  onBack: () => void
}

interface IResultInfo {
  score: number
  total: number
  average: number
  time: number
  isRightOn: boolean
  isWrongOn: boolean
  onAll: () => void
  onRight: () => void
  onWrong: () => void
}

interface IResultReview {
  list: IQuestion[]
  onBack: () => void
}

enum EState {
  Info,
  Review
}

const ResultInfo: React.FC<IResultInfo> = (props) => {
  const {
    score, total,
    isWrongOn, isRightOn,
    onAll, onRight,
    onWrong
  } = props
  return (
    <div className="result-info">
      <div className="score-display">
        <p>Result</p>
        <p>{score} / {total}</p>
      </div>
      <div className="info">
        <span>Time: {Timer.format(props.time)}</span>
        <span title="Average time between question">
          Average: {(props.average / 1000).toFixed(3)} s</span>
      </div>
      <div className="options">
        <ListComponent>
          <ListItemButton
            text="all answers"
            onButton={onAll}
          />
          <ListItemButton
            text="right answers"
            preview={`${score}`}
            isEnable={isRightOn}
            onButton={onRight}
            icon={CheckCircle}
          />
          <ListItemButton
            text="wrong answers"
            preview={`${total - score}`}
            isEnable={isWrongOn}
            onButton={onWrong}
            icon={XCircle}
          />
        </ListComponent>
      </div>
      {props.children}
    </div>
  )
}

const ResultReview: React.FC<IResultReview> = (props) => {
  const { list, onBack } = props
  const [current, setCurrent] = useState<IQuestion>()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setCurrent(list[index])
  }, [])

  const onNext = useCallback((inc: number) => {
    const tmp = (index + inc) % list.length
    const i = tmp > -1 ? tmp : 0
    setIndex(i)
    console.log(i)
    setCurrent(list[i])
  }, [index])

  return (
    <div className="result-review">
      <ToolsTop>
        <div className="top">
          <span>{index + 1} / {list.length}</span>
        </div>
      </ToolsTop>
      {current && <Review question={current} />}
      <FloatToolsContainer>
        <FloatTool icon={ChevronLeft}
          text="prev"
          onButtonClick={() => onNext(-1)}
        />
        <FloatTool
          icon={FileEarmarkCodeFill}
          text="result"
          onButtonClick={onBack}/>
        <FloatTool
          icon={ChevronRight}
          isRight={true}
          text="next"
          onButtonClick={() => onNext(1)}
        />
      </FloatToolsContainer>
    </div>
  )
}

export const Results: React.FC<IResults> = (props) => {
  const { session, user } = props
  const total = session.questions.length
  const [state, setState] = useState(EState.Info)
  const [score, setScore] = useState(0)

  const [correctList, setCorrectList] = useState<IQuestion[]>([])
  const [wrongList, setWrongList] = useState<IQuestion[]>([])
  const [current, setCurrent] = useState<IQuestion[]>()

  useEffect(() => {
    const correctList: IQuestion[] = []
    const wrongList: IQuestion[] = []
    let score = 0
    session.questions.forEach((question, index) => {
      const correct = question.options.reduce(
        (a, b) => (b.correct ? 1 : 0) + a
        , 0)
      const markedCorrect = question.options.reduce(
        (a, b) => (b.marked ? (b.marked === b.correct ? 1 : -1) : 0) + a
        , 0)
      const isCorrect = correct === markedCorrect
      const confidence = markedCorrect > -1 ? markedCorrect / correct : 0

      if (isCorrect) {
        correctList.push(question)
        score++
      } else {
        wrongList.push(question)
      }

      // Store the history data for the user
      const stat = user.questions.get(question.source)
      if (stat) {
        stat.history.push({
          confidence,
          correct: isCorrect,
          unix: session.end
        })
      } else {
        user.questions.set(question.source, {
          history: [{
            confidence,
            correct: isCorrect,
            unix: session.end
          }]
        })
      }
    })

    setWrongList(wrongList)
    setCorrectList(correctList)
    setScore(score)
    props.onSave()
  }, [session])

  const onReview = useCallback((correct: boolean | undefined = undefined) => {
    if (correct === undefined) setCurrent(session.questions)
    else if (correct === true) setCurrent(correctList)
    else setCurrent(wrongList)

    setState(EState.Review)
  }, [correctList, wrongList])

  return (
    <div className="results">
      {state === EState.Info && <ResultInfo
        time={session.end - session.start}
        average={(session.end - session.start) / total}
        score={score}
        total={total}
        onAll={() => onReview()}
        onRight={() => onReview(true)}
        onWrong={() => onReview(false)}
        isRightOn={score !== 0}
        isWrongOn={score !== total}>
        <FloatToolsContainer>
          <FloatTool
            icon={FileEarmarkCodeFill}
            text="home"
            onButtonClick={props.onBack}
          />
        </FloatToolsContainer>
      </ResultInfo>}
      {state === EState.Review && current &&
       <ResultReview
         list={current}
         onBack={() => setState(EState.Info)}
       />}
    </div>
  )
}
