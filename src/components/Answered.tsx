import React, {
  useEffect,
  useState,
  ReactElement
} from 'react'

import { OptionElement, OptionContainer } from './OptionComponent'
import { Flag, FlagFill } from '../assets/icons'

import { IQuestionModel } from '../model/question'

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
