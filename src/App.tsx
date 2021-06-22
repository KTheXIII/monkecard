import React, {
  useState,
  useEffect
} from 'react'
import yaml from 'js-yaml'

import { AppMain } from './components/AppMain'
import { Question } from './components/Question'
import { Results } from './components/Results'

import {
  IQOptionModel,
  IFetchQuestionModel,
  IQuestionModel,
  IQSessionModel
} from './model/question'

enum Pages {
  Main,
  Question,
  Results
}

const URL = './quiz/system-dev.yml'

export const App: React.FC = () => {
  const [active, setActive] = useState<Pages>(Pages.Main)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSession, setCurrentSession] = useState<IQSessionModel>({
    questions: [],
    start: 0,
    end: 0
  })

  // TODO: Move this out
  function processQuiz(raw: IFetchQuestionModel[]): boolean {
    const quizs: IQuestionModel[] = raw.map((data) => {
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
        isAnswered: false,
      }
    })

    setCurrentSession({
      questions: quizs,
      start: 0,
      end: 0
    })
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
            setIsLoaded(processQuiz(data.questions as IFetchQuestionModel[]))
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
              currentSession.start = Date.now()
              setCurrentSession(currentSession)
              setActive(Pages.Question)
            }
          }} />
      }
      {active == Pages.Question &&
        <Question
          session={currentSession}
          onBack={() => {
            setActive(Pages.Main)
          }}
          onDone={(result) => {
            let correctCount = 0
            result.questions.forEach(question => {
              let isCorrect = true
              question.options.forEach(opt => {
                if (opt.correct != opt.marked) {
                  isCorrect = false
                  return
                }
              })
              if (isCorrect) correctCount++
            })
            console.log(correctCount + ' out of ' + result.questions.length)
            console.log(result)

            const delta = result.end - result.start
            console.log('time: ' + (delta / 1000) + ' s')
            console.log('time per question: ' +
             (delta / result.questions.length / 1000) + ' s')

            // setActive(Pages.Main)
            setActive(Pages.Results)
          }}
        />
      }
      {active == Pages.Results &&
        <Results
          onBack={() => {
          // FIXME: Save result and reset the questions
            setActive(Pages.Main)
          }}
          session={currentSession}
        />
      }
    </div>
  )
}
