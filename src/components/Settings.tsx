import React from 'react'

import { VERSION } from '../scripts/config'

import '../style/settings.scss'

export const Settings: React.FC = (props) => {
  return (
    <div className="settings">
      <span>{VERSION}</span>
    </div>
  )
}
