import React, {
  useState,
  useEffect,
  ReactElement
} from 'react'
import yaml from 'js-yaml'

import { AppMain } from './components/AppMain'
import { Question } from './components/Question'

import { IQuestionModel } from './model/question'

enum Pages {
  Main,
  Quiz
}

const URL = './static/assets/system-dev.yml'

export const App: React.FC = (props): ReactElement => {
  const [active, setActive] = useState<Pages>(Pages.Main)
  const [questions, setQuestions] = useState<IQuestionModel[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch(URL)
      .then(res => {
        if (res.status == 200) return res.text()
        else throw new Error('File not found: ' + res.status)
      })
      .then(text => {
        try {
          const questionData = yaml.load(text) as any
          if (questionData.version == '0.0') {
            setQuestions(questionData.questions as IQuestionModel[])
            setIsLoaded(true)
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
            if (isLoaded)
              setActive(Pages.Quiz)
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
