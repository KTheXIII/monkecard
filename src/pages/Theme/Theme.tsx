import React, {
  useRef, useCallback, useEffect
} from 'react'
import { Check2, ChevronLeft } from '@assets/BootstrapIcons'

import {
  ListComponent,
  ListItemButton
} from '@components/List'

import { THEME_LIST, setTheme } from '@scripts/theme'
import { IUser } from '@models/user.model'

interface ITheme {
  user: IUser
  onSave: () => void
  onBack: () => void
}

export const Theme: React.FC<ITheme> = (props) => {
  const themeRef = useRef<HTMLDivElement | null>(null)
  const { user } = props

  let lastTheme = props.user.settings.theme
  const onMouseEnter = useCallback((index: number) => {
    setTheme(lastTheme, THEME_LIST[index])
    lastTheme = THEME_LIST[index]
  }, [user, lastTheme])

  const onSelect = useCallback((index: number) => {
    setTheme(lastTheme, THEME_LIST[index])
    user.settings.theme = THEME_LIST[index]
    props.onSave()
  }, [user, lastTheme])

  function onClickOutside(event: MouseEvent) {
    if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
      document.body.className = user.settings.theme
    }
  }

  useEffect(() => {
    document.body.className = user.settings.theme
    document.addEventListener('mousedown', onClickOutside)
    document.body.classList.add('theme-transition')

    return () => {
      document.body.classList.remove('theme-transition')
      document.body.className = user.settings.theme
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [user.settings.theme])

  return (
    <div className="theme" ref={themeRef}>
      <ListComponent>
        <ListItemButton
          iconL={ChevronLeft}
          text="back"
          onClick={props.onBack}
          hideIconR={true}
        />
      </ListComponent>
      <ListComponent>
        {THEME_LIST.map((theme, index) => {
          return (
            <ListItemButton
              hideIconL={true}
              hideIconR={user.settings.theme !== theme}
              iconR={Check2}
              iconEmptyR={false}
              onMouseEnter={() => onMouseEnter(index)}
              onClick={() => onSelect(index)}
              text={theme}
              key={index}
            />
          )
        })}
      </ListComponent>
    </div>
  )
}
