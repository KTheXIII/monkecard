import React, { useState, useEffect } from 'react'
import yaml from 'js-yaml'

import { MToolsFloat } from './MToolsFloat'
import {
  CardContainer,
  CardComponent,
  CardElement
} from './CardComponent'
import { Settings } from './Settings'

import {
  IFetchQuestionModel,
  IQOptionModel,
  IQSessionModel,
  IQuestionModel
} from '../model/question'
import { DESCRIPTOR_URL } from '../scripts/config'

import '../style/main.scss'

enum EMain {
  Home,
  Settings
}

interface IAppMain {
  onStart: (session: IQSessionModel) => void
}

const QUESTION_URL = './questions/systemdev/systemdev.yml'

function processQuestions(questions: IFetchQuestionModel[]): IQuestionModel[] {
  const quizs: IQuestionModel[] = questions.map((data) => {
    const options: IQOptionModel[] = data.options
      .map((opt, index) => {
        return {
          text: opt,
          marked: false,
          correct:  data.correct.includes(index)
        }
      })

    return {
      content: data.content,
      image: data.image,
      options,
      source: data.source,
      isMarked: false,
      isAnswered: false,
    }
  })

  return  quizs
}

export const AppMain: React.FC<IAppMain> = (props) => {
  const [active, setActive] = useState<EMain>(EMain.Home)
  const [rawQuestions, setRawQuestions] = useState<IFetchQuestionModel[]>([])
  const [currentSession, setCurrentSession] = useState<IQSessionModel>({
    questions: [],
    start: 0,
    end: 0
  })

  useEffect(() => {
    fetch(QUESTION_URL)
      .then(res => {
        if (res.ok) return res.text()
        else throw new Error('Can\'t fetch the data')
      })
      .then(text => {
        try {
          const data = yaml.load(text) as any
          if (data.version == '0.0.0') {
            const quizes = data.questions as IFetchQuestionModel[]
            setRawQuestions(quizes)
          }
        } catch (e) {
          throw new Error('Not correct yaml format')
        }
      })
  }, [])

  return (
    <main>
      {active == EMain.Home &&
        <CardContainer>
          <CardComponent title="main">
            <CardElement
              text="start"
              onButtonClick={() => {
                currentSession.questions = processQuestions(rawQuestions)
                // unix time in milliseconds since 1970-01-01 00:00:00 UTC.
                currentSession.start = Date.now()
                setCurrentSession(currentSession)

                props.onStart(currentSession)
              }} />
          </CardComponent>
        </CardContainer>
      }
      {active == EMain.Settings &&
        <Settings/>
      }
      <MToolsFloat
        onHome={() => setActive(EMain.Home)}
        onSettings={() => setActive(EMain.Settings)}
      />
    </main>
  )
}
