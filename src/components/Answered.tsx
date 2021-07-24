import React, {
  useEffect,
  useState,
  ReactElement
} from 'react'

import {
  OptionElement,
  OptionContainer
} from './Option'
import { Flag, FlagFill } from '@assets/icons'

import { IQuestion } from '@models/question.model'

interface IAnswered {
  onCancel: () => void
  onClick: (index: number) => void

  questionList: IQuestion[]
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
          onButton={() => props.onClick(index)}
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
