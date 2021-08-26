import React, {
  useState,
  useEffect,
  useCallback,
  ReactElement,
  useRef,
} from 'react'

import { PinAngle, PinAngleFill } from '@assets/BootstrapIcons'
import { MToolsFloat } from '@components/MToolsFloat'
import { SubjectInfo } from '@components/SubjectInfo'
import {
  ListContainer,
  ListComponent,
  ListItemMark,
  ListItemButton,
  ListItemRaw
} from '@components/List'
import { Settings, ISettingsRef } from '@pages/Settings'

import { IUser } from '@models/user.model'
import {
  ISubject,
  TQuestionMap,
} from '@models/question.model'

enum EMain {
  Home,
  Settings
}

enum EHome {
  Main,
  Subject,
}

interface IMain {
  onSave: (user: IUser) => void
  onStart: (ids: Set<string>) => void

  isLoading: boolean
  user: IUser
  questions: TQuestionMap
  subjects: ISubject[]
}

export const Main: React.FC<IMain> = (props) => {
  const settingsRef = useRef<ISettingsRef>(null)
  const [active, setActive] = useState<EMain>(EMain.Home)
  const [activeHome, setActiveHome] = useState<EHome>(EHome.Main)

  const [pinList, setPinList] = useState<ReactElement[]>([])
  const [subjectList, setSubjectList] = useState<ReactElement>()
  const [subject, setSubject] = useState<ISubject | null>(null)
  const { isLoading } = props

  function renderSubjectList() {
    const pinList = props.subjects
      .filter(value => props.user.pins.has(value.title))
      .map((value, page) => {
        const idSet = new Set<string>()
        value.categories.forEach(category => {
          category.questions.forEach(q => idSet.add(q))
        })
        const catCount = value.categories.length
        const confidence = ([...idSet].reduce((acc, cur) => {
          const uc = props.user.questions.get(cur)
          return uc ? acc + uc.confidence : acc
        }, 0) / idSet.size).toFixed(2)

        return (
          <ListComponent
            key={value.title + '-' + page}>
            <ListItemRaw>
              <div className="info">
                <div className="info__header">
                  <span>{value.title}</span>
                  <button onClick={() => {
                    value.showCategory = !value.showCategory
                    renderSubjectList()
                  }}>{value.showCategory ? 'collapse' : 'more'}</button>
                </div>
                <div className="info__body">
                  <div className="stat">
                    <span>{confidence} | {catCount} | {idSet.size}</span>
                  </div>
                  <div className="actions">
                    <button
                      onClick={() => {
                        const ids = new Set<string>()
                        for (const category of value.selected)
                          category.questions.forEach(q => ids.add(q))

                        if (value.selected.size == 0)
                          value.categories
                            .forEach(c => c.questions.forEach(q => ids.add(q)))
                        props.onStart(ids)
                      }}
                    >start</button>
                  </div>
                </div>
              </div>
            </ListItemRaw>
            {value.showCategory && value.categories
              .map((cat, index) => {
                // FIXME: The category list generation needs to rework because
                //        this is  repeated in the subject info.
                const confidence = cat.questions
                  .reduce((a, c) => {
                    const uc = props.user.questions.get(c)
                    return uc ? a + uc.confidence : a
                  }, 0) / cat.questions.length

                const preview = props.user.settings.showConfidence ?
                  `${confidence.toFixed(2)}` : `${cat.questions.length}`
                return (
                  <ListItemMark
                    key={cat.id + '-' + index}
                    text={cat.name || cat.id}
                    preview={preview}
                    onMark={mark => {
                      if (mark) value.selected.add(cat)
                      else value.selected.delete(cat)
                    }}
                    isMarked={value.selected.has(cat)}
                    stateLorR={true}
                    hideIconL={true}
                  />
                )
              })}
          </ListComponent>
        )
      })
    setPinList(pinList)

    const subjectList = props.subjects
      .map((value, index) => {
        return (
          <ListItemButton
            key={value.title + '-' + index}
            text={value.title}
            onClick={() => {
              setSubject(value)
              setActiveHome(EHome.Subject)
            }}
            iconR={props.user.pins.has(value.title) ? PinAngleFill : PinAngle}
            hideIconL={true}
          />
        )
      })
    setSubjectList(
      <ListComponent text="subjects">
        {subjectList}
      </ListComponent>
    )
  }

  useEffect(() => {
    renderSubjectList()

  }, [isLoading, props.questions, props.subjects, props.user])

  const onHome = useCallback(() => {
    setActive(EMain.Home)
    setActiveHome(EHome.Main)
    renderSubjectList()
  }, [props.user, props.subjects])

  return (
    <div className="main-page">
      {active === EMain.Home &&
        <div className="home">
          {isLoading && <p>loading...</p>}
          {!isLoading &&
            <div className="view">
              {activeHome === EHome.Main && <div className="home__main">
                <ListContainer text="pin" emptyText="(˚☐˚! )/">
                  {pinList}
                </ListContainer>
                {subjectList}
              </div>}
              {activeHome === EHome.Subject && subject &&
                <div className="home__subject">
                  <SubjectInfo
                    onStart={props.onStart}
                    onSave={props.onSave}
                    onBack={() => {
                      setActiveHome(EHome.Main)
                    }}
                    user={props.user} subject={subject} />
                </div>}
            </div>}
        </div>
      }
      {active === EMain.Settings &&
        <Settings
          ref={settingsRef}
          questions={props.questions}
          user={props.user}
          onSave={props.onSave}
        />
      }
      <MToolsFloat
        onHome={() => onHome()}
        onSettings={() => {
          setActive(EMain.Settings)
          if (settingsRef.current)
            settingsRef.current.onShow()
        }}
      />
    </div>
  )
}
