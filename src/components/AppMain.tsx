import React, { useState } from 'react'

import { MToolsFloat } from './MToolsFloat'

import {
  CardContainer,
  CardComponent,
  CardElement
} from './CardComponent'

import { Settings } from './Settings'

import '../style/main.scss'

enum EMain {
  Home,
  Settings
}

interface IAppMain {
  onStart: () => void
}

export const AppMain: React.FC<IAppMain> = (props) => {
  const [active, setActive] = useState<EMain>(EMain.Home)

  return (
    <main>
      {active == EMain.Home &&
        <CardContainer>
          <CardComponent title="main">
            <CardElement
              text="start"
              onClick={() => {
                props.onStart()
              }} />
          </CardComponent>
        </CardContainer>
      }
      {active == EMain.Settings &&
        <Settings/>
      }
      <MToolsFloat
        onHome={() => setActive(EMain.Home)}
        onSettings={() => setActive(EMain.Settings)}
      />
    </main>
  )
}
