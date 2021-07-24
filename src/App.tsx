import React, { useState, useEffect } from 'react'

import { Main } from '@pages/Main'
import { QuestionPage } from '@pages/QuestionPage'
import { Results } from '@pages/Results'

import { ISession } from '@models/question.model'

import './app.scss'

enum EPages {
  Main,
  Question,
  Results
}

// TODO: Move the fetch logic service here
//       and send it as a prop to other pages.
//       This will allow us to have control over when data is fetched.
//       Reload data and refresh the page can be done more easily.

export const App: React.FC = () => {
  const [active, setActive] = useState<EPages>(EPages.Main)
  const [currentSession, setCurrentSession] = useState<ISession>({
    questions: [],
    start: 0,
    end: 0
  })

  return (
    <div className='app'>
      {active == EPages.Main &&
        <Main
          onStart={(session) => {
            setCurrentSession(session)
            setActive(EPages.Question)
          }}
        />
      }
      {active == EPages.Question &&
        <QuestionPage
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
            // setCurrentSession(session)
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
