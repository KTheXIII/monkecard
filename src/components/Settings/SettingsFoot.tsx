import React from 'react'

import {
  COMMIT_HASH,
  REPOSITORY_URL,
  VERSION
} from '@scripts/env'

export const SettingsFoot: React.FC = (props) => {
  return (
    <div className="text-center font-mono text-sm font-light pb-24">
      <a
        title="Github repository link"
        className="text-mt-1 transition-colors duration-100x ease-in hover:text-mt-0"
        rel="noreferrer"
        target="_blank"
        href={REPOSITORY_URL}>
            v{VERSION}-{COMMIT_HASH.substring(0, 7)}
      </a>
      {/* <a
          title="report bugs link"
          className="ml-4 text-mt-1 transition-colors duration-100x ease-in hover:text-mt-0"
          rel="noreferrer"
          target="_blank"
          href={`${REPOSITORY_URL}/issues`}
        >report bugs</a> */}
    </div>
  )
}
