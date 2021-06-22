import React, {
  ReactElement,
  useEffect,
  useState,
  useRef
} from 'react'
import ReactMarkdown from 'react-markdown'

import { ToolsTop } from './ToolsTop'
import { QToolsFloat } from './QToolsFloat'
import { QOptionContainer, QOption } from './QOption'
import { Answered } from './Answered'

import { IQSessionModel, IQuestionModel } from '../model/question'

import '../style/question.scss'

const TIMER_UPDATE_DELAY = 1000  // ms

interface IQuestion {
  session: IQSessionModel
  onBack: () => void
  onDone: (session: IQSessionModel) => void
}

export const Question: React.FC<IQuestion> = (props) => {
  const start = props.session.start
  const container = useRef<HTMLDivElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFlagOn, setFlagOn] = useState(false)
  const [isLast, setIsLast] = useState(false)

  const [answeredList, setAnsweredList] = useState<IQuestionModel[]>([])
  const [answeredIDs, setAnsweredIDs] = useState<number[]>([])
  const [showAnswered, setShowAnswered] = useState(false)

  const [imageLink, setImageLink] = useState<string | undefined>()
  const [content, setContent] = useState('')
  const [options, setOptions] = useState<ReactElement[]>([])

  const [currentQIndex, setCurrentQIndex] = useState(0)

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
    setQuestion(0)
    questions[0].isAnswered = true
    console.log(questions)
  }, [])

  function onFlag() {
    questions[currentQIndex].isMarked = !isFlagOn
    setFlagOn(questions[currentQIndex].isMarked)
    // TODO: On when question is flagged
  }

  function onNext() {
    if (currentQIndex != -1 && !questions[currentQIndex].isAnswered) return
    if (currentQIndex == questions.length - 1) {
      session.end = Date.now()
      props.onDone(session)
      return
    }

    const index = (currentQIndex + 1) % questions.length
    // FIXME: NEED TO THINK MORE ABOUT THIS
    questions[index].isAnswered = true

    setCurrentQIndex(index)
    setQuestion(index)
  }

  function onAnswered() {
    // TODO: On show answered list
    const ids: number[] = []
    const answered: IQuestionModel[] = questions
      .filter((data, index) => {
        if (data.isAnswered)
          ids.push(index)
        return data.isAnswered
      })

    if (answered.length === 0 && answered.length !== ids.length) return
    container.current?.style.setProperty('overflow', 'hidden')
    setAnsweredIDs(ids)
    setAnsweredList(answered)
    setShowAnswered(true)
  }

  function onMark(i: number, mark: boolean) {
    questions[currentQIndex].options[i].marked = mark
  }

  function setQuestion(index: number) {
    const question = questions[index]

    setIsLast(index == questions.length - 1)
    setFlagOn(question.isMarked)
    setImageLink(question.image?.source)
    setContent(question.content)
    setOptions(
      question.options.map((data, index) => {
        return <QOption
          key={question.source + '-' + index}
          text={data.text}
          isMarked={data.marked}
          index={index}
          onMark={onMark}
        />
      })
    )
  }

  return (
    <div
      className="question"
      ref={container}
    >
      <ToolsTop
        backButton={props.onBack}
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
        <QOptionContainer>
          {options}
        </QOptionContainer>
      </div>
      {showAnswered &&
      <Answered onCancel={() => {
        setShowAnswered(false)
        container.current?.style.setProperty('overflow', 'auto')
      }}
      onClick={(index) => {
        setShowAnswered(false)
        setCurrentQIndex(index)
        setQuestion(index)
        container.current?.style.setProperty('overflow', 'auto')
      }}
      idList={answeredIDs}
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
