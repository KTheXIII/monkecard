import React from 'react'

import { FloatTool, FloatToolsContainer } from './ToolsFloat'

import { FileEarmarkCodeFill, UIRadios } from '../assets/icons'

export const MToolsFloat: React.FC = () => {
  return (
    <FloatToolsContainer>
      <FloatTool
        icon={FileEarmarkCodeFill}
        text="home"
      />
      <FloatTool
        title="more settings"
        icon={UIRadios}
        text="more"
      />
    </FloatToolsContainer>
  )
}
