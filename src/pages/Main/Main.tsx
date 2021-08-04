import React, {
  useState,
  useEffect,
  useCallback,
  ReactElement
} from 'react'

import { MToolsFloat } from '@components/MToolsFloat'
import {
  ListComponent,
  ListItemMark,
  ListItemButton
} from '@components/List'
import { Settings } from '@pages/Settings'

import { IUser } from '@models/user.model'
import {
  ISession,
  ISubject,
  TQuestionMap,
  ICategory,
  IQuestion,
} from '@models/question.model'

enum EMain {
  Home,
  Settings
}

interface IMain {
  onStart: (session: ISession) => void
  onSave: () => void
  isLoading: boolean
  user: IUser
  questions: TQuestionMap
  subjects: ISubject[]
}

export const Main: React.FC<IMain> = (props) => {
  const [active, setActive] = useState<EMain>(EMain.Home)
  const [questionList, setQuestionList] = useState<ReactElement[]>([])
  const [enableStart, setEnableStart] = useState<boolean>(false)

  const { isLoading } = props
  const [subjects, setSubjects] = useState<ISubject[]>(props.subjects)
  const [questionMap, setQuestionMap] = useState<TQuestionMap>(props.questions)
  const categorySet = new Set<ICategory>()

  function renderList() {
    // Generate card component with subject ids or name
    const questionList = subjects.map((value, page) => {
      const { title, categories } = value
      const children = categories.map((value, index) => {
        const confidence = value.questions
          .reduce((a, c) => {
            const uq = props.user.questions.get(c)
            return uq ? a + uq.confidence : a
          }, 0) / value.questions.length
        const preview = props.user.settings.showConfidence ?
          `${confidence.toFixed(2)}` : `${value.questions.length}`
        return (
          <ListItemMark
            key={value.id + '-' + index}
            text={value.name || value.id}
            preview={preview}
            onMark={(mark) => onMark(page, index, mark)}
            isMarked={categorySet.has(value)}
            hideIconR={true}
          />
        )
      })
      return (
        <ListComponent
          key={title + '-' + page}
          header={title}>
          {children}
        </ListComponent>
      )
    })

    setQuestionList(questionList)
  }

  useEffect(() => {
    setSubjects(props.subjects)
    setQuestionMap(props.questions)
    renderList()

  }, [isLoading, props.questions, props.subjects])

  const onStart = useCallback(() => {
    const { user } = props
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
    const questions: IQuestion[] = sortConfidence
      .filter((_, index) => index < user.settings.maxQuestions)
      .map(value => {
        return {
          ...value,
          options: value.options.map(op => {return { ...op }})
        }
      })

    props.onStart({
      start: Date.now(),
      end: 0,
      questions
    })
  }, [questionMap, props.user])

  function onMark(page: number, index: number, mark: boolean) {
    const subject = subjects[page].categories[index]
    if (mark)
      categorySet.add(subject)
    else
      categorySet.delete(subject)

    setEnableStart(categorySet.size > 0)
  }

  const onHome = useCallback(() => {
    setActive(EMain.Home)
    renderList()
  }, [questionMap, subjects, props.user])

  return (
    <div className="main-page">
      {active === EMain.Home &&
        <div className="subjects">
          {isLoading && <p>loading...</p>}
          {questionList}
          <ListComponent>
            <ListItemButton
              text="start selected"
              onButton={() => onStart()}
              hideIconR={true}
              isEnable={enableStart}
            />
          </ListComponent>
        </div>
      }
      {active === EMain.Settings &&
        <Settings
          questions={questionMap}
          user={props.user}
          onSave={() => props.onSave()}
        />
      }
      <MToolsFloat
        onHome={() => onHome()}
        onSettings={() => setActive(EMain.Settings)}
      />
    </div>
  )
}
