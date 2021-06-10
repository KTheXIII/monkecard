import React, {
  useState,
  useEffect
} from 'react'
import yaml from 'js-yaml'

import { AppMain } from './components/AppMain'
import { Question } from './components/Question'

import {
  IQOptionModel,
  IQuestionModel,
  IQuizModel
} from './model/question'

enum Pages {
  Main,
  Quiz
}

const URL = './static/assets/system-dev.yml'

export const App: React.FC = () => {
  const [active, setActive] = useState<Pages>(Pages.Main)
  const [questions, setQuestions] = useState<IQuizModel[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // TODO: Move this out
  function processQuiz(raw: IQuestionModel[]): boolean {
    const quizs: IQuizModel[] = raw.map((data) => {
      const options: IQOptionModel[] = data.options
        .map((opt, optIndex) => {
          const correct = data.correct.includes(optIndex)

          return {
            text: opt,
            marked: false,
            correct
          }
        })

      return {
        content: data.content,
        image: data.image,
        options,
        source: data.source,
        isMarked: false,
        isAnswered: false
      }
    })

    setQuestions(quizs)
    return quizs.length != 0
  }

  useEffect(() => {
    fetch(URL)
      .then(res => {
        if (res.ok) return res.text()
        else throw new Error('File not found: ' + res.status)
      })
      .then(text => {
        try {
          const data = yaml.load(text) as any
          if (data.version == '0.0') {
            setIsLoaded(processQuiz(data.questions as IQuestionModel[]))
          }
        } catch (e) {
          throw new Error('Not correct yaml format')
        }
      }).catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className='app'>
      {active == Pages.Main &&
        <AppMain
          onStart={() => {
            if (isLoaded) {
              // FIXME: The questions needs to be reset when launch again
              setActive(Pages.Quiz)
            }
          }} />
      }
      {active == Pages.Quiz &&
        <Question
          questions={questions}
          onBack={() => {
            setActive(Pages.Main)
          }}
        />
      }
    </div>
  )
}
