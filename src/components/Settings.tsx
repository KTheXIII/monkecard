import React from 'react'

import { COMMIT_HASH, VERSION } from '../scripts/config'

import '../style/settings.scss'

export const Settings: React.FC = (props) => {
  return (
    <div className="settings">
      <span>{VERSION}</span>
      <span>-</span>
      <span>{COMMIT_HASH.substring(0, 7)}</span>
    </div>
  )
}
