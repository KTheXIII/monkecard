import React from 'react'

import '../style/settings.scss'

export const Settings: React.FC = (props) => {
  return (
    <div className="settings">
      <span>{__SNOWPACK_ENV__.VERSION}</span>
    </div>
  )
}
