import React, {
  ReactElement,
  useEffect,
  useState
} from 'react'
import ReactMarkdown from 'react-markdown'

import { ToolsTop } from './ToolsTop'
import { QToolsFloat } from './QToolsFloat'
import { QOptionContainer, QOption } from './QOption'

import { IQuizModel } from '../model/question'

import '../style/question.scss'

const TIMER_UPDATE_DELAY = 1000  // ms

interface IQuestion {
  questions: IQuizModel[]
  onBack: () => void
}

export const Question: React.FC<IQuestion> = (props) => {
  const start = Date.now()
  const [currentTime, setCurrentTime] = useState(0)
  const [isFlagOn, setFlagOn] = useState(false)

  const [imageLink, setImageLink] = useState<string | undefined>()
  const [content, setContent] = useState('')
  const [options, setOptions] = useState<ReactElement[]>([])

  let qIndex = 0 // A hack for getting questionIndex value
  const [questionIndex, setQuestionIndex] = useState(qIndex)

  const questions = props.questions

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - start)
    }, TIMER_UPDATE_DELAY)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    qIndex = questionIndex
  }, [questionIndex])

  function onFlag() {
    questions[qIndex].isMarked = !isFlagOn
    setFlagOn(questions[qIndex].isMarked)
    // TODO: On when question is flagged
  }

  function onNext() {
    // TODO: On next question
    qIndex = (questionIndex + 1) % props.questions.length
    const quiz = questions[qIndex]
    setQuestionIndex(qIndex)

    setFlagOn(quiz.isMarked)

    setImageLink(quiz.image?.source)
    setContent(quiz.content)

    setOptions(
      quiz.options.map((data, index) => {
        return <QOption
          key={quiz.source + '-' + index}
          text={data.text}
          isMarked={data.marked}
          index={index}
          onMark={onMark}
        />
      })
    )
  }

  function onAnswered() {
    // TODO: On show answered list
  }

  function onMark(i: number, mark: boolean) {
    questions[qIndex].options[i].marked = mark
  }

  useEffect(() => {
    onNext()
  }, [])

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
