import React, {
  ReactElement,
  useEffect,
  useState,
  useRef
} from 'react'
import ReactMarkdown from 'react-markdown'

import { ToolsTop } from '@components/ToolsTop'
import { QToolsFloat } from '@components/QToolsFloat'
import {
  OptionContainer,
  OptionMarkElement
} from '@components/Option'
import { Answered } from '@components/Answered'

import { ISession, IQuestion } from '@models/question.model'

import './question.scss'

const TIMER_UPDATE_DELAY = 1000  // ms

interface ICQuestion {
  session: ISession
  onBack: () => void
  onDone: (session: ISession) => void
}

export const Question: React.FC<ICQuestion> = (props) => {
  const start = props.session.start
  const container = useRef<HTMLDivElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFlagOn, setFlagOn] = useState(false)
  const [isLast, setIsLast] = useState(false)
  const [isBookmark, setIsBookmark] = useState(false)

  const [answeredList, setAnsweredList] = useState<IQuestion[]>([])
  const [showAnswered, setShowAnswered] = useState(false)

  const [imageLink, setImageLink] = useState<string | undefined>()
  const [content, setContent] = useState('')
  const [options, setOptions] = useState<ReactElement[]>([])

  // Hack for fixing state not updating fast enough
  let currentIndex = 0
  const [questionIndex, setQuestionIndex] = useState(currentIndex)

  const session = props.session
  const questions = session.questions

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

  function onFlag() {
    questions[currentIndex].isMarked = !isFlagOn
    setFlagOn(questions[currentIndex].isMarked)
  }

  function onNext() {
    if (questionIndex === questions.length - 1) {
      session.end = Date.now()
      props.onDone(session)
      return
    }

    currentIndex = (questionIndex + 1) % questions.length
    questions[currentIndex].isAnswered = true

    setQuestionIndex(currentIndex)
    setQuestion(currentIndex)
  }

  function onAnswered() {
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
  }

  function onMark(i: number, mark: boolean) {
    questions[currentIndex].options[i].marked = mark
  }

  function onBookmark(mark: boolean) {
    console.log(`bookmark: ${currentIndex} - ${mark}`)
  }

  function setQuestion(index: number) {
    const question = questions[index]

    setIsLast(index == questions.length - 1)
    setFlagOn(question.isMarked)
    setImageLink(question.image?.source)
    setContent(question.content)
    setOptions(question.options.map((data, index) => {
      return (
        <OptionMarkElement
          key={question.source + '-' + index}
          text={data.text}
          isMarked={data.marked}
          index={index}
          onMark={onMark}
        />
      )
    })
    )
  }

  return (
    <div className="question" ref={container}>
      <ToolsTop
        onBack={props.onBack}
        onBookmark={onBookmark}
        isBookmarked={isBookmark}
        time={currentTime} />
      <div className="q-display">
        <div className="q-image-container">
          {imageLink && <img src={imageLink} />}
        </div>
        <div className="q-content-container">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
        <OptionContainer>
          {options}
        </OptionContainer>
      </div>
      {showAnswered &&
      <Answered onCancel={() => {
        setShowAnswered(false)
        container.current?.style.setProperty('overflow', 'auto')
      }}
      onClick={(index) => {
        setShowAnswered(false)
        setQuestionIndex(index)
        setQuestion(index)
        currentIndex = index
        container.current?.style.setProperty('overflow', 'auto')
      }}
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
