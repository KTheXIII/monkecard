import React, {
  useState,
  useEffect,
  useMemo,
} from 'react'

import { Monke } from '@scripts/monke'
import { UserMonke } from '@scripts/user'

  interface Props {
    isLoading: boolean
    monke: Monke
    user: UserMonke
  }

export const DashboardPage: React.FC<Props> = (props) => {
  return (
    <div></div>
  )
}

