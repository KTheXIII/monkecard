import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'

import { QuestionContent, QuestionImage } from '@components/Question'
import { OptionContainer, Option } from '@components/Option'
import {
  XCircleFill,
  Circle,
  CheckCircle,
  CheckCircleFill,
} from '@assets/icons'

import { IQuestion } from '@models/question.model'

interface IReview {
  question: IQuestion
}

export const Review: React.FC<IReview> = (props) => {
  const { question } = props
  const { image } = question
  const [options, setOptions] = useState<ReactElement[]>([])

  useEffect(() => {
    setOptions(question.options.map((opt, i) => {
      return (
        <Option
          key={`${question.source}-${i}`}
          icon={
            opt.correct ?
              opt.marked ? CheckCircleFill : CheckCircle
              :
              opt.marked ? XCircleFill : Circle
          }
          css={
            opt.correct ?
              'right'
              :
              opt.marked ? 'wrong' : ''
          }
          text={opt.text}
          disabled={true}
        />
      )
    }))
  }, [question])

  return (
    <div className="review">
      {image && <QuestionImage src={image.source} alt={image.alt} />}
      <QuestionContent text={question.content}/>
      <OptionContainer>
        {options}
      </OptionContainer>
    </div>
  )
}
