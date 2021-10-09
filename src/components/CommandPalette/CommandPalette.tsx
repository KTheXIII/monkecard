import React, {} from 'react'
interface Props {
  isHidden: boolean
  isLoading: boolean
}

export const CommandPalette: React.FC<Props> = (props) => {
  const { isHidden } = props
  return (
    <div className="command-palette">
      {!isHidden && <div className="container"></div>}
    </div>
  )
}
