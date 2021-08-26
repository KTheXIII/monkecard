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

import {
  ISession,
  ISubject,
  TQuestionMap,
  IQuestion
} from '@models/question.model'
import { IUser } from '@models/user.model'

import './app.scss'
import { setTheme } from '@scripts/theme'
import * as Session from '@scripts/session'

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
      setTheme('auto-theme', user.settings.theme)

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

  const save = useCallback(async (newUser) => {
    try {
      const savedUser = await User.save(newUser)
      setTheme(user.settings.theme, savedUser.settings.theme)
      setUser(savedUser)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }, [user])

  const start = useCallback((ids: Set<string>) => {
    if (ids.size === 0) return

    const questionToBeUse: IQuestion[] = []
    for (const id of ids) {
      const question = questions.get(id)
      if (question)
        questionToBeUse.push(question)
    }

    // FIXME: Move this out of here
    // NOTE: This is a hack for randomising the question with confidence metric.
    //       This will need to be re-implement later when we have a better way
    const sortConfidence = questionToBeUse.sort((a, b) => {
      const qa = user.questions.get(a.source)
      const qb = user.questions.get(b.source)
      if (qa && qb) {
        return qa.confidence - qb.confidence
      } else if (qa) {
        return qa.confidence - Math.random()
      } else if (qb) {
        return qb.confidence - Math.random()
      } else {
        return Math.random() > 0.5 ? 1 : -1
      }
    })

    // NOTE: Get the maximum number of questions according to user's
    //       max question per session
    const sorted: IQuestion[] = sortConfidence
      .filter((_, index) => index < user.settings.maxQuestions)
      .map(value => {
        return {
          ...value,
          options: value.options.map(op => { return { ...op } })
        }
      })

    setCurrentSession(Session.create(sorted))
    setActive(EPages.Question)
  }, [user, questions])

  useEffect(() => {
    load().then(() => {
      setIsLoading(false)
    }).catch(err => console.error(err))
  }, [])

  return (
    <div className='app'>
      {active == EPages.Main &&
        <Main
          onStart={start}
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
            save(user)
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
