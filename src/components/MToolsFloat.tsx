import React from 'react'

import {
  FloatTool,
  FloatToolsContainer
} from './ToolsFloat'

import { FileEarmarkCodeFill, MenuButtonWideFill } from '@assets/BootstrapIcons'

interface IMTools {
  onHome: () => void
  onSettings: () => void
}

export const MToolsFloat: React.FC<IMTools> = (props) => {
  return (
    <FloatToolsContainer>
      <FloatTool
        onButtonClick={() => props.onHome()}
        icon={FileEarmarkCodeFill}
        text="home"
      />
      <FloatTool
        onButtonClick={() => props.onSettings()}
        title="more settings"
        icon={MenuButtonWideFill}
        text="more"
      />
    </FloatToolsContainer>
  )
}
