import React, { useEffect } from 'react'
import { FileEarmarkCodeFill } from '../assets/icons'
import { IQSessionModel } from '../model/question'

import { FloatTool, FloatToolsContainer } from './ToolsFloat'

interface IResults {
  session: IQSessionModel
  onBack: () => void
}

export const Results: React.FC<IResults> = (props) => {
  useEffect(() => {
    console.log(props.session)
  }, [])

  return (
    <div className="results">
      <FloatToolsContainer>
        <FloatTool
          icon={FileEarmarkCodeFill}
          text="home"
          onClick={props.onBack}
        />
      </FloatToolsContainer>
    </div>
  )
}
