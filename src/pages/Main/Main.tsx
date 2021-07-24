import React, {
  useState,
  useEffect,
  useCallback,
  ReactElement
} from 'react'

import { MToolsFloat } from '@components/MToolsFloat'
import {
  CardContainer,
  CardComponent,
  CardElement,
  CardMarkElement,
} from '@components/Card'
import { Preference } from '@pages/Settings'

import * as Download from '@scripts/download'
import * as User from '@scripts/user'

import { IUserModel } from '@models/user.model'
import {
  ISession,
  ISubject,
  TQuestionMap,
  ICategory,
  IQuestion,
} from '@models/question.model'

enum EMain {
  Home,
  Preference
}

interface IMain {
  onStart: (session: ISession) => void
}

// TODO: Move out fetch logic and take in question, user and subject data

export const Main: React.FC<IMain> = (props) => {
  const [active, setActive] = useState<EMain>(EMain.Home)
  const [cards, setCards] = useState<ReactElement[]>([])
  const [enableStart, setEnableStart] = useState<boolean>(false)

  let userData: IUserModel
  let questionMap: TQuestionMap
  let subjects: ISubject[]
  const categorySet = new Set<ICategory>()

  function onMark(page: number, index: number, mark: boolean) {
    const subject = subjects[page].categories[index]
    if (mark)
      categorySet.add(subject)
    else
      categorySet.delete(subject)

    setEnableStart(categorySet.size > 0)
  }

  const onStart = useCallback(() => {
    const questionSet = new Set<string>()
    for (const { questions } of categorySet) {
      questions.forEach(value => {
        questionSet.add(value)
      })
    }

    const questionToBeUse: IQuestion[] = []
    for (const id of questionSet) {
      const question = questionMap.get(id)
      if (question)
        questionToBeUse.push({ ...question })
    }

    props.onStart({
      start: Date.now(),
      end: 0,
      questions: questionToBeUse,
    })
  }, [])

  async function init() {
    try {
      const files = await Download.files()
      subjects = await Download.subjects(files)
      questionMap = await Download.questions(subjects)
      userData = await User.request()
    } catch (err) {
      return Promise.reject(err)
    }

    renderList()

    return Promise.resolve()
  }

  function renderList() {
    // const size = subjects.map(v => v.categories.length)
    //                      .reduce((a, b) => a + b)

    // Generate card component with subject ids or name
    const cardList = subjects.map((value, page) => {
      const { title, categories } = value
      const children = categories.map((value, index) => {
        return (
          <CardMarkElement
            key={value.id + '-' + index}
            text={value.name || value.id}
            page={page}
            index={index}
            onMark={(mark) => onMark(page, index, mark)}
            isMarked={categorySet.has(value)}
            isLast={index === categories.length - 1}
          />
        )
      })
      return (
        <CardComponent
          key={title + '-' + page}
          title={title}>
          {children}
        </CardComponent>
      )
    })

    // setUser(userData)
    setCards(cardList)
  }

  useEffect(() => {
    init().catch(err => console.error(err))
  }, [])

  const onHome = useCallback(() => {
    setActive(EMain.Home)
    renderList()
  }, [])

  return (
    <div className="main-page">
      {active === EMain.Home &&
        <CardContainer>
          {cards}
          <CardComponent>
            <CardElement
              text="start selected"
              onButtonClick={() => {
                onStart()
              }}
              isEnable={enableStart}
            />
          </CardComponent>
        </CardContainer>
      }
      {active === EMain.Preference &&
        <Preference/>
      }
      <MToolsFloat
        onHome={() => onHome()}
        onSettings={() => setActive(EMain.Preference)}
      />
    </div>
  )
}
