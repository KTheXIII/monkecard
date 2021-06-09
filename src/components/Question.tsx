import React, {
  ReactElement,
  useEffect,
  useState
} from 'react'
import ReactMarkdown from 'react-markdown'

import { ToolsTop } from './ToolsTop'
import { QToolsFloat } from './QToolsFloat'
import { QOptionContainer, QCreateOptions } from './QOption'

import { IQuestionModel } from '../model/question'

import '../style/question.scss'

const TIMER_UPDATE_DELAY = 1000  // ms

interface IQuestion {
  questions: IQuestionModel[]
  onBack: () => void
}

export const Question: React.FC<IQuestion> = (props) => {
  const start = Date.now()
  const [currentTime, setCurrentTime] = useState(0)
  const [isFlagOn, setFlagOn] = useState(false)

  const [imageLink, setImageLink] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [options, setOptions] = useState<ReactElement[]>([])

  let activeQuestion: IQuestionModel

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - start)
    }, TIMER_UPDATE_DELAY)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const { questions } = props
    activeQuestion = questions[Math.floor(questions.length * Math.random())]
    if (activeQuestion.image) setImageLink(activeQuestion.image.source)
    setContent(activeQuestion.content)
    setOptions(QCreateOptions(activeQuestion.options, onMark))
  }, [])

  function onFlag() {
    setFlagOn(!isFlagOn)
    // TODO: On when question is flagged
  }

  function onNext() {
    // TODO: On next question
  }

  function onAnswered() {
    // TODO: On show answered
  }

  function onMark(index: number, marked: boolean) {
    // TODO: On when option is marked
  }

  return (
    <div className="question">
      <ToolsTop
        backButton={props.onBack}
        time={currentTime} />
      <div className="display">
        <div className="image-container">
          {imageLink && <img src={imageLink} />}
        </div>
        <div className="content-container">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
        <QOptionContainer>
          {options}
        </QOptionContainer>
      </div>
      <QToolsFloat
        isFlagOn={isFlagOn}
        onMark={() => {
          onFlag()
        }}
        onAnswered={() => {
          onAnswered()
        }}
        onNext={() => {
          onNext()
        }} />
    </div>
  )
}
