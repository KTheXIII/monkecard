import React, {
  useEffect,
  useState,
  ReactElement
} from 'react'

import {
  OptionElement,
  OptionContainer
} from './Option/Option'
import { Flag, FlagFill } from '@assets/icons'

import { IQuestionModel } from '@models/question.model'

interface IAnswered {
  onCancel: () => void
  onClick: (index: number) => void

  questionList: IQuestionModel[]
}

export const Answered: React.FC<IAnswered> = (props) => {
  const { questionList } = props
  const [options, setOptions] = useState<ReactElement[]>()

  useEffect(() => {
    const opts = questionList.map((data, index) => {
      const title = data.content.split('\n')[0].replaceAll('#', '')
      return (
        <OptionElement
          icons={[Flag, FlagFill]}
          key={data.source + '-' + index}
          onButtonClick={() => props.onClick(index)}
          text={title}
          isMarked={data.isMarked}
        />
      )
    })
    setOptions(opts)
  }, [])

  return (
    <div className="answered">
      <OptionContainer>
        {options}
      </OptionContainer>
    </div>
  )
}
