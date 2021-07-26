import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'
import ReactMarkdown from 'react-markdown'

import {
  OptionContainer,
  OptionMarkElement,
} from '@components/Option'

import { IQuestion, IImage } from '@models/question.model'

interface IQuestionContent {
  text: string
}

export const QuestionContent: React.FC<IQuestionContent> = (props) => {
  return (
    <div className="question-content">
      <ReactMarkdown>
        {props.text}
      </ReactMarkdown>
    </div>
  )
}

interface IQuestionImage {
  src: string
  alt?: string
}

export const QuestionImage: React.FC<IQuestionImage> = (props) => {
  return (
    <div className="question-image">
      <img src={props.src} alt={props.alt} />
    </div>
  )
}

interface IQuestionMulit {
  question: IQuestion
  onMark: (i: number, mark: boolean) => void
  isPadTop?: boolean
}

export const QuestionMulti: React.FC<IQuestionMulit> = (props) => {
  const { question, onMark } = props
  const isPadTop = props.isPadTop !== undefined
    ? props.isPadTop : false
  const [image, setImage] = useState<IImage>()
  const [content, setContent] = useState<string>('')
  const [options, setOptions] = useState<ReactElement[]>([])

  useEffect(() => {
    if (question) {
      setImage(question.image)
      setContent(question.content)

      setOptions(question.options.map((opt, i) => {
        return (
          <OptionMarkElement
            key={`${question.source}-${i}`}
            text={opt.text}
            isMarked={opt.marked}
            index={i}
            onMark={onMark}
          />
        )
      }))
    }
  }, [question])

  return (
    <div className="question">
      {isPadTop && <div className="pad-top"></div>}
      {image && <QuestionImage src={image.source} alt={image.alt} />}
      <QuestionContent text={content} />
      <OptionContainer>
        {options}
      </OptionContainer>
    </div>
  )
}
