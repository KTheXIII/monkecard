import React, { useState, useEffect } from 'react'
import yaml from 'js-yaml'

import { MToolsFloat } from '@components/MToolsFloat'
import {
  CardContainer,
  CardComponent,
  CardElement,
  CardMarkElement
} from '@components/Card/Card'
import { Preference } from '@pages/Settings/Settings'

import {
  IQOptionModel,
  IQSessionModel,
  IQuestionModel
} from '@models/question.model'
import { IRawQuestionModel } from '@models/raw.model'

import './main.scss'

enum EMain {
  Home,
  Preference
}

interface IAppMain {
  onStart: (session: IQSessionModel) => void
}

const QUESTION_URL = './questions/systemdev/systemdev.yml'

function processQuestions(questions: IRawQuestionModel[]): IQuestionModel[] {
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

export const Main: React.FC<IAppMain> = (props) => {
  const [active, setActive] = useState<EMain>(EMain.Home)
  const [rawQuestions, setRawQuestions] = useState<IRawQuestionModel[]>([])
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
          const data = yaml.load(text) as TAny
          if (data.version && data.version == '0.0.0') {
            const quizes = data.questions as IRawQuestionModel[]
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
      {active == EMain.Preference &&
        <Preference/>
      }
      <MToolsFloat
        onHome={() => setActive(EMain.Home)}
        onSettings={() => setActive(EMain.Preference)}
      />
    </main>
  )
}
