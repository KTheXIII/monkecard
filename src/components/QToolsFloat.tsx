import React, { useState } from 'react'

import { FloatTool, FloatToolsContainer } from './ToolsFloat'

import {
  Files,
  Flag,
  FlagFill,
  ChevronRight,
  Check2
} from '../assets/icons'

interface IQToolsFloat {
  onAnswered: () => void
  onMark: () => void
  onNext: () => void

  isFlagOn: boolean
  isLast: boolean
}

export const QToolsFloat: React.FC<IQToolsFloat> = (props) => {
  return (
    <FloatToolsContainer>
      <FloatTool
        onClick={props.onAnswered}
        icon={Files}
        text="answered" />
      <FloatTool
        onClick={props.onMark}
        icon={props.isFlagOn ? FlagFill : Flag}
        text="mark" />
      <FloatTool
        onClick={props.onNext}
        icon={props.isLast ? Check2 : ChevronRight}
        text={props.isLast ? 'done' : 'next'} />
    </FloatToolsContainer>
  )
}
