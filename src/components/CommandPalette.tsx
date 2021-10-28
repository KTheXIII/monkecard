import React, {} from 'react'
interface Props {
  isHidden: boolean
  isLoading: boolean
}

export const CommandPalette: React.FC<Props> = (props) => {
  const { isHidden } = props
  return (
    <div className="command-palette fixed top-0 left-1/2 -translate-x-1/2">
      {!isHidden && <div className="bg-mblue p-1 w-28 rounded-memo"></div>}
    </div>
  )
}
