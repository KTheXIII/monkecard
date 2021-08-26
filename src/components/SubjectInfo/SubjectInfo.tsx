import React, { useState, useEffect } from 'react'
import {
  ListComponent,
  ListItemRaw,
  ListItemMark
} from '@components/List'

import { PinAngle, PinAngleFill } from '@assets/BootstrapIcons'

import { ISubject } from '@models/question.model'
import { IUser } from '@models/user.model'
import { ReactElement } from 'react-markdown'

interface SubjectInfoProps {
  user: IUser
  subject: ISubject

  onStart: (ids: Set<string>) => void
  onBack: () => void
  onSave: (user: IUser) => void
}

export const SubjectInfo: React.FC<SubjectInfoProps> = (props) => {
  const { user, subject } = props

  const idSet = new Set<string>()
  subject.categories.forEach(category => {
    category.questions.forEach(q => idSet.add(q))
  })
  const catCount = subject.categories.length
  const confidence = ([...idSet].reduce((acc, cur) => {
    const uc = props.user.questions.get(cur)
    return uc ? acc + uc.confidence : acc
  }, 0) / idSet.size).toFixed(2)

  const [isPinned, setIsPinned] = useState(user.pins.has(subject.title))
  const [categories, setCategories] = useState<ReactElement[]>([])

  useEffect(() => {
    setIsPinned(user.pins.has(subject.title))
    renderList()
  }, [user, subject])

  function onStart() {

    const ids = new Set<string>()
    for (const category of subject.selected)
      category.questions.forEach(q => ids.add(q))

    if (subject.selected.size == 0)
      subject.categories
        .forEach(c => c.questions.forEach(q => ids.add(q)))
    props.onStart(ids)
  }

  function renderList() {
    const list = subject.categories.map((value, index) => {
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
          onMark={(mark) => {
            if (mark)
              subject.selected.add(value)
            else
              subject.selected.delete(value)
          }}
          isMarked={subject.selected.has(value)}
          stateLorR={true}
          hideIconL={true}
        />
      )
    })

    setCategories(list)
  }

  return (
    <div className="subject__info">
      <div className="subject__info__title">
        <h1>{subject.title}</h1>
        <div className="tools">
          <button onClick={() => {
            if (user.pins.has(subject.title))
              user.pins.delete(subject.title)
            else
              user.pins.add(subject.title)
            props.onSave(user)

            setIsPinned(user.pins.has(subject.title))
          }}>
            <div className="icon">
              {isPinned ? PinAngleFill : PinAngle}
            </div>
          </button>
        </div>
      </div>
      <ListComponent>
        <ListItemRaw>
          <div className="subject__info__tool">
            <div className="subject__info__stat">
              <span>{confidence} | {catCount} | {idSet.size}</span>
            </div>
            <div className="subject__info__actions">
              <button onClick={() => onStart()} >start</button>
            </div>
          </div>
        </ListItemRaw>
      </ListComponent>
      <div className="subject__info__categories">
        <ListComponent text="categories">
          {categories}
        </ListComponent>
      </div>
    </div>
  )
}
