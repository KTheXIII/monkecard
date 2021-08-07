import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle
} from 'react'

import {
  COMMIT_HASH,
  VERSION,
  REPOSITORY_URL
} from '@scripts/config'
import {
  ListComponent,
  ListItemInputSwitch,
  ListItemButton,
  ListItemMark
} from '@components/List'
import {
  Bookmarks,
  Pen,
  ClockHistory,
  Palette2,
  Hash,
  Trash,
  InfoCircle,
  Circle,
  CheckCircle
} from '@assets/BootstrapIcons'

import { Theme } from '@pages/Theme'

import { IUser } from '@models/user.model'
import { TQuestionMap } from '@models/question.model'

interface ISettings {
  user: IUser
  questions: TQuestionMap
  onSave: () => void
}

export interface ISettingsRef {
  onShow: () => void
}

enum Sections {
  General,
  Theme
}

interface IGeneral extends ISettings {
  onTheme: () => void
}

const General: React.FC<IGeneral> = (props) => {
  const { user } = props

  return (
    <div className="general">
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
          isEnable={true}
          text="change theme"
          preview={user.settings.theme}
          iconL={Palette2}
          onButton={props.onTheme}
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
        <ListItemMark
          text="show confidence"
          onMark={(mark) => {
            user.settings.showConfidence = mark
            props.onSave()
          }}
          icons={[CheckCircle, Circle]}
          preview={user.settings.showConfidence ? 'true' : 'false'}
          isMarked={user.settings.showConfidence}
          stateLorR={true}
          icon={InfoCircle}
        />
        <ListItemButton
          isEnable={false}
          text="saved questions"
          preview={`${user.saved.size}`}
          iconL={Bookmarks}
          onButton={() => {
                // TODO: open saved questions
            console.log(user.saved)
          }}
        />
        <ListItemButton
          isEnable={false}
          text="history"
          preview={`${user.questions.size}`}
          iconL={ClockHistory}
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
          iconL={Trash}
          onButton={() => {
            if (confirm('clear all history?')) {
              user.questions.clear()
              props.onSave()
            }
          }}
        />
      </ListComponent>
    </div>
  )
}

export const Settings = forwardRef<ISettingsRef, ISettings>((props, ref) => {
  const [section, setSection] = useState(Sections.General)

  useImperativeHandle(ref, () => ({
    onShow: () => {
      setSection(Sections.General)
    }
  }))

  useEffect(() => {
    props.onSave()
  }, [])

  return (
    <div className="settings">
      {section === Sections.General &&
        <General
          user={props.user}
          onSave={props.onSave}
          questions={props.questions}
          onTheme={() => {
            setSection(Sections.Theme)
          }}
        />
      }
      {section === Sections.Theme &&
        <Theme onBack={() => {
          setSection(Sections.General)
        }}
        onSave={props.onSave}
        user={props.user} />
      }
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
})
