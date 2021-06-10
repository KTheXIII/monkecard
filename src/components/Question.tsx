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
  const [isLast, setIsLast] = useState(false)

  const [imageLink, setImageLink] = useState<string | undefined>()
  const [content, setContent] = useState('')
  const [options, setOptions] = useState<ReactElement[]>([])

  let qIndex = -1 // A hack for getting questionIndex value
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
    onNext()
  }, [])

  function onFlag() {
    questions[questionIndex].isMarked = !isFlagOn
    setFlagOn(questions[questionIndex].isMarked)
    // TODO: On when question is flagged
  }

  function onNext() {
    if (questionIndex != -1 && !questions[questionIndex].isAnswered) return
    if (questionIndex == questions.length - 1) {
      // TODO: Check the questions
      console.log('done!')
      return
    }

    qIndex = (questionIndex + 1) % questions.length
    const quiz = questions[qIndex]
    setQuestionIndex(qIndex)

    // FIXME: NEED TO THINK MORE ABOUT THIS
    questions[qIndex].isAnswered = true

    // Show the questions and option to view
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

    setIsLast(qIndex == questions.length - 1)
  }

  function onAnswered() {
    // TODO: On show answered list
    const answered: IQuizModel[] = questions
      .filter(data => data.isAnswered == true)
    console.log(answered)
  }

  function onMark(i: number, mark: boolean) {
    questions[qIndex].options[i].marked = mark
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
        isLast={isLast}
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
