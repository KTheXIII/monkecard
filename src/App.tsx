import React, { useState } from 'react'

import { AppMain } from './components/AppMain'
import { Question } from './components/Question'
import { Results } from './components/Results'

import { IQSessionModel } from './model/question'

enum EPages {
  Main,
  Question,
  Results
}

export const App: React.FC = () => {
  const [active, setActive] = useState<EPages>(EPages.Main)
  const [currentSession, setCurrentSession] = useState<IQSessionModel>({
    questions: [],
    start: 0,
    end: 0
  })

  return (
    <div className='app'>
      {active == EPages.Main &&
        <AppMain
          onStart={(session) => {
            setCurrentSession(session)
            setActive(EPages.Question)
          }}
        />
      }
      {active == EPages.Question &&
        <Question
          session={currentSession}
          onBack={() => {
            setActive(EPages.Main)
          }}
          onDone={(session) => {
            let correctCount = 0
            session.questions.forEach(question => {
              let isCorrect = true
              question.options.forEach(opt => {
                if (opt.correct != opt.marked) {
                  isCorrect = false
                  return
                }
              })
              if (isCorrect) correctCount++
            })
            console.log(correctCount + ' out of '
             + session.questions.length)
            console.log(session)

            const delta = session.end - session.start
            console.log('time: ' + (delta / 1000) + ' s')
            console.log('time per question: ' +
             (delta / session.questions.length / 1000) + ' s')

            // setActive(Pages.Main)
            setActive(EPages.Results)
          }}
        />
      }
      {active == EPages.Results &&
        <Results
          onBack={() => {
          // FIXME: Save result and reset the questions
            setActive(EPages.Main)
          }}
          session={currentSession}
        />
      }
    </div>
  )
}
