import React, { useEffect } from 'react'

import { COMMIT_HASH, VERSION } from '@scripts/config'

import { IHistoryModel } from '@models/user.model'

import './settings.scss'

export const Preference: React.FC = (props) => {
  useEffect(() => {
    //
  }, [])

  return (
    <div className="settings">
      <div className="info">
        <span>{VERSION}</span>
        <span>-</span>
        <span>{COMMIT_HASH.substring(0, 7)}</span>
      </div>
    </div>
  )
}
