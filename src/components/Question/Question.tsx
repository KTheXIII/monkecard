import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'
import ReactMarkdown from 'react-markdown'

import {
  Circle,
  CircleFill,
  CircleSlash
} from '@assets/icons'
import {
  OptionContainer,
  OptionMarkElement,
  Option
} from '@components/Option'

import { IQuestion, IImage } from '@models/question.model'

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
            key={question.source + '-' + i}
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
    <div className={'question'}>
      {isPadTop && <div className="pad-top"></div>}
      <div className="image-container">
        {image && <img src={image.source} alt={image.alt} />}
      </div>
      <div className="content-container">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
      <OptionContainer>
        {options}
      </OptionContainer>
    </div>
  )
}
