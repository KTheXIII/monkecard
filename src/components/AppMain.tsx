import React from 'react'

import { MToolsFloat } from './MToolsFloat'

import {
  CardOptionList,
  CardOptions,
  CardOption
} from './CardOptions'

import '../style/main.scss'

interface IAppMain {
  onStart: () => void
}

export const AppMain: React.FC<IAppMain> = (props) => {
  return (
    <main>
      <CardOptionList>
        <CardOptions title="main">
          <CardOption
            text='start'
            onClick={() => {
              props.onStart()
            }} />
        </CardOptions>
      </CardOptionList>
      <MToolsFloat />
    </main>
  )
}
