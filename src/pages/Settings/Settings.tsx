import React, { useState, useEffect } from 'react'

import {
  COMMIT_HASH,
  VERSION,
  REPOSITORY_URL
} from '@scripts/config'
import {
  ListComponent,
  ListItemInputSwitch,
  ListItemButton
} from '@components/List'
import {
  Bookmarks,
  Pen,
  ClockHistory,
  Palette2,
  Hash,
  Trash
} from '@assets/icons'

import { IUser } from '@models/user.model'
import { TQuestionMap } from '@models/question.model'

interface ISettings {
  user: IUser
  questions: TQuestionMap
  onSave: () => void
}

export const Settings: React.FC<ISettings> = (props) => {
  const { user } = props

  useEffect(() => {
    props.onSave()
  }, [])

  return (
    <div className="settings">
      <div className="settings-content">
        <div className="user-info">
          <span className="username">{user.name}</span>
        </div>
        <ListComponent>
          <ListItemInputSwitch
            text="edit name"
            icon={Pen}
            preview={user.name}
            onConfirm={(value) => {
              user.name = value
              props.onSave()
            }}/>
          <ListItemButton
            isEnable={false}
            text="change theme"
            preview={user.settings.theme}
            icon={Palette2}
            onButton={() => {
              // TODO: open theme picker
            }}
          />
          <ListItemInputSwitch
            isEnable={true}
            text="question/session"
            preview={`${user.settings.maxQuestions}`}
            icon={Hash}
            onConfirm={(value) => {
              if (!isNaN(parseInt(value))) {
                user.settings.maxQuestions = parseInt(value)
                props.onSave()
              }
            }}
          />
          <ListItemButton
            isEnable={false}
            text="saved questions"
            preview={`${user.saved.size}`}
            icon={Bookmarks}
            onButton={() => {
              // TODO: open saved questions
              console.log(user.saved)
            }}
          />
          <ListItemButton
            isEnable={false}
            text="history"
            preview={`${user.questions.size}`}
            icon={ClockHistory}
            onButton={() => {
              // TODO: The history size needs to be calculated
              //       and displayed in the preview text.
              //       The data structure is a map and of each
              //       question with its own history.
              // TODO: open history
              console.log(user.questions)
            }}
          />
        </ListComponent>
        <ListComponent>
          <ListItemButton
            text="clear history"
            icon={Trash}
            onButton={() => {
              if (confirm('clear all history?')) {
                user.questions.clear()
                props.onSave()
              }
            }}
          />
        </ListComponent>
      </div>
      <div className="app-info">
        <a
          title="Github repository link"
          rel="noreferrer"
          target="_blank"
          className="github-link"
          href={REPOSITORY_URL}
        >v{VERSION}-{COMMIT_HASH.substring(0, 7)}</a>
        <a href={`${REPOSITORY_URL}/issues`}>bug report</a>
      </div>
    </div>
  )
}
