import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useRef
} from 'react'

import { ToolsTop } from '@components/ToolsTop'
import { QToolsFloat } from '@components/QToolsFloat'
import { Answered } from '@components/Answered'
import { QuestionMulti } from '@components/Question'

import { ISession, IQuestion } from '@models/question.model'

const TIMER_UPDATE_DELAY = 1000  // ms

interface IQuestionPage {
  session: ISession
  onBack: () => void
  onDone: (session: ISession) => void
}

export const QuestionPage: React.FC<IQuestionPage> = (props) => {
  const start = props.session.start
  const container = useRef<HTMLDivElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion>()
  const [isFlagOn, setFlagOn] = useState(false)
  const [isLast, setIsLast] = useState(false)
  const [isBookmark, setIsBookmark] = useState(false)

  const [answeredList, setAnsweredList] = useState<IQuestion[]>([])
  const [showAnswered, setShowAnswered] = useState(false)

  let currentIndex = 0

  const { session } = props
  const { questions } = session

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - start)
    }, TIMER_UPDATE_DELAY)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setQuestion(currentIndex)
    questions[currentIndex].isAnswered = true
  }, [])

  const onFlag = useCallback(() => {
    questions[currentIndex].isMarked = !questions[currentIndex].isMarked
    setFlagOn(questions[currentIndex].isMarked)
  }, [currentIndex])

  const onNext = useCallback(() => {
    if (currentIndex === questions.length - 1) {
      session.end = Date.now()
      props.onDone(session)
      return
    }

    currentIndex = (currentIndex + 1) % questions.length
    questions[currentIndex].isAnswered = true

    setQuestion(currentIndex)
  }, [currentIndex])

  const onAnswered = useCallback(() => {
    // TODO: On show answered list
    const ids: number[] = []
    const answered: IQuestion[] = questions
      .filter((data, index) => {
        if (data.isAnswered)
          ids.push(index)
        return data.isAnswered
      })

    if (answered.length === 0 && answered.length !== ids.length) return
    container.current?.style.setProperty('overflow', 'hidden')
    setAnsweredList(answered)
    setShowAnswered(true)
  }, [currentIndex])

  const onMark = useCallback((i: number, mark: boolean) => {
    questions[currentIndex].options[i].marked = mark
  }, [currentIndex])

  const onBookmark = useCallback((mark: boolean) => {
    console.log(`bookmark: ${currentIndex} - ${mark}`)
  }, [currentIndex])

  const setQuestion = useCallback((index: number) => {
    const question = questions[index]

    setIsLast(index == questions.length - 1)
    setFlagOn(question.isMarked)
    setCurrentQuestion(question)

    // Scoll to the top when a new question is rendered
    window.scrollTo(0, 0)
  }, [])

  const onSelectQuestion = useCallback((index: number) => {
    currentIndex = index
    setShowAnswered(false)
    setQuestion(index)
    currentIndex = index
    container.current?.style.setProperty('overflow', 'auto')
  }, [currentIndex])

  return (
    <div className="question-page" ref={container}>
      <ToolsTop
        onBack={props.onBack}
        onBookmark={onBookmark}
        isBookmarked={isBookmark}
        time={currentTime} />
      {currentQuestion && <QuestionMulti
        question={currentQuestion}
        onMark={onMark}
        isPadTop={true}
      />}
      {showAnswered && <Answered
        onCancel={() => {
          setShowAnswered(false)
          container.current?.style.setProperty('overflow', 'auto')
        }}
        onClick={onSelectQuestion}
        questionList={answeredList}
      />}
      <QToolsFloat
        isFlagOn={isFlagOn}
        isLast={isLast}
        onMark={() => {
          onFlag()
        }}
        onAnswered={onAnswered}
        onNext={() => {
          onNext()
        }} />
    </div>
  )
}
