import React, {
  useEffect,
  useState,
  ReactElement
} from 'react'

import { CircleFill, Circle } from '../assets/icons'

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
    console.log('hello')
    console.log(props.idList)
    console.log(props.questionList)

    if (props.idList.length != props.questionList.length)
      props.onCancel()
    else {
      const opts = props.questionList.map((data, index) => {
        const title = data.content.split('\n')[0].replaceAll('#', '')
        const id = props.idList[index]
        return (
          <button
            className="question-opt"
            key={data.source + '-' + id}
            onClick={() => props.onClick(id)}
          >
            <div className="button-display">
              <div className="icon">{data.isMarked ? CircleFill : Circle}</div>
              <div className="text">{title}</div>
            </div>
          </button>
        )
      })

      setOptions(opts)
    }
  }, [])

  return (
    <div className="answered">
      <div className="a-container">
        <div className="question-options">
          {options}
        </div>
      </div>
    </div>
  )
}
