import React from 'react'
import { ChevronRight } from '@assets/BootstrapIcons'

import {
  ListComponent,
  ListItemText,
  ListItemButton,
  ListItemInputText,
  ListItemMark,
  ListItemInputSwitch
} from '@components/List'
import { Palette2 } from '@assets/BootstrapIcons'

import './test-page.scss'

export const TestPage: React.FC = (props) => {
  return (
    <div className="test__page">
      <div className="content">
        <ListComponent header="Test list">
          <ListItemInputText placeholder="hmmm" />
          <ListItemText text="Hello World!"/>
          <ListItemButton hideIconL={false} text="Hello There" />
          <ListItemButton hideIconL={false} text="Hello There"
            preview="wowoowwo"
          />
          <ListItemButton
            hideIconL={true}
            isEnable={false}
            iconEmptyR={true}
            text="Hello There"
            preview="wow"
          />
          <ListItemButton
            iconL={Palette2}
            text="Hello Thef"
            hideIconR={true}
            preview="well hello there"
            iconR={ChevronRight} />
          <ListItemInputText default="Test" />
          <ListItemMark
            text="Mark me"
            isMarked={false} onMark={(mark) => {
              console.log(mark)
            }} />
          <ListItemInputSwitch
            text="edit"
            preview="wow"
            onConfirm={(value) => {
              console.log(value)
            }}
          />
        </ListComponent>
      </div>
    </div>
  )
}
