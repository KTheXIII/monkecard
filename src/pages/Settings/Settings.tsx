import React, { useEffect } from 'react'

import {
  COMMIT_HASH,
  VERSION,
  REPOSITORY_URL
} from '@scripts/config'

export const Preference: React.FC = (props) => {
  useEffect(() => {
    //
  }, [])

  return (
    <div className="settings">
      <div className="info">
        <span></span>
        <a
          title="Github repository link"
          rel="noreferrer"
          target="_blank"
          className="github-link"
          href={REPOSITORY_URL}
        >v{VERSION}-{COMMIT_HASH.substring(0, 7)}</a>
      </div>
    </div>
  )
}
