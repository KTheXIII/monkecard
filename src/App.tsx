import React, { useState, ReactElement } from 'react'

import { AppMain } from './components/AppMain'
import { Question } from './components/Question'

enum Pages {
  Main,
  Quiz
}

export const App: React.FC = (props): ReactElement => {
  const [active, setActive] = useState<Pages>(Pages.Main)

  return (
    <div className='app'>
      {active == Pages.Main &&
        <AppMain
          onStart={() => {
            setActive(Pages.Quiz)
          }} />
      }
      {active == Pages.Quiz &&
        <Question
          onBack={() => {
            setActive(Pages.Main)
          }}
        />
      }
    </div>
  )
}
