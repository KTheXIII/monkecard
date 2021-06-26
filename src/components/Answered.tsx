import React, {
  useEffect,
  useState,
  ReactElement
} from 'react'

import { OptionElement, OptionContainer } from './OptionComponent'

import { IQuestionModel } from '../model/question'

interface IAnswered {
  onCancel: () => void
  onClick: (index: number) => void

  idList: number[]
  questionList: IQuestionModel[]
}

export const Answered: React.FC<IAnswered> = (props) => {
  const [options, setOptions] = useState<ReactElement[]>()

  useEffect(() => {
    if (props.idList.length != props.questionList.length)
      props.onCancel()
    else {
      const opts = props.questionList.map((data, index) => {
        const title = data.content.split('\n')[0].replaceAll('#', '')
        const id = props.idList[index]
        return <OptionElement
          key={data.source + '-' + id}
          onButtonClick={() => props.onClick(id)}
          text={title}
          isMarked={data.isMarked}/>
      })
      setOptions(opts)
    }
  }, [])

  return (
    <div className="answered">
      <OptionContainer>
        {options}
      </OptionContainer>
    </div>
  )
}
