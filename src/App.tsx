import React, {
  useState,
  useEffect,
  useCallback
} from 'react'

import { Main } from '@pages/Main'
import { QuestionPage } from '@pages/QuestionPage'
import { Results } from '@pages/Results'
import * as Download from '@scripts/download'
import * as User from '@scripts/user'

// import { TestPage } from '@pages/TestPage'

import {
  ISession,
  ISubject,
  TQuestionMap,
  IQuestion
} from '@models/question.model'
import { IUser } from '@models/user.model'

import './app.scss'

enum EPages {
  Main,
  Question,
  Results,
}

interface IData {
  user: IUser
  subjects: ISubject[]
  questions: TQuestionMap
}

const data: IData = {
  user: User.of(),
  subjects: [],
  questions: new Map<string, IQuestion>(),
}

export const App: React.FC = () => {
  const [active, setActive] = useState<EPages>(EPages.Main)
  const [currentSession, setCurrentSession] = useState<ISession>({
    questions: [],
    start: 0,
    end: 0
  })
  const [user, setUser] = useState<IUser>(data.user)
  const [subjects, setSubjects] = useState<ISubject[]>(data.subjects)
  const [questions, setQuestions] = useState<TQuestionMap>(data.questions)
  const [isLoading, setIsLoading] = useState(true)

  async function load() {
    try {
      const user = await User.request()
      User.save(user)
      const files = await Download.files()
      const subjects = await Download.subjects(files)
      const questions = await Download.questions(subjects)

      setUser(user)
      setSubjects(subjects)
      setQuestions(questions)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const save = useCallback(async ()  => {
    try {
      const savedUser = await User.save(user)
      setUser(savedUser)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }, [user])

  useEffect(() => {
    load().then(() => {
      setIsLoading(false)
    }).catch(err => console.error(err))
  }, [])

  // return (
  //   <div className="app">
  //     <TestPage/>
  //   </div>
  // )

  return (
    <div className='app'>
      {active == EPages.Main &&
        <Main
          onStart={(session) => {
            setCurrentSession(session)
            console.log(session)
            setActive(EPages.Question)
          }}
          onSave={save}
          isLoading={isLoading}
          user={user}
          subjects={subjects}
          questions={questions}
        />
      }
      {active == EPages.Question &&
        <QuestionPage
          onSave={(user) => {
            setUser(user)
            save()
          }}
          user={user}
          session={currentSession}
          onBack={() => {
            setActive(EPages.Main)
          }}
          onDone={(s) => {
            setCurrentSession(s)
            setActive(EPages.Results)
          }}
        />
      }
      {active == EPages.Results &&
        <Results
          user={user}
          onSave={save}
          onBack={() => setActive(EPages.Main)}
          session={currentSession}
        />
      }
    </div>
  )
}
