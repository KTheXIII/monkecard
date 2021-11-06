import React, {
  forwardRef,
  useState,
  useImperativeHandle
} from 'react'

import { ICollectionSet } from '@models/dataset'
import { SettingsFoot } from '@components/Settings/SettingsFoot'
import { SettingsMain } from '@components/Settings/SettingsMain'
import { EditSource } from '@components/Settings/EditSource'

interface Props {
  collections: ICollectionSet[]
  onReload: () => void
}

export interface SettingsPageRef {
  onActive: () => void
}

enum SettingsPageState {
  Main,
  EditSource
}

export const SettingsPage = forwardRef<SettingsPageRef, Props>((props, ref) => {
  const [state, setState] = useState(SettingsPageState.Main)

  useImperativeHandle(ref, () => ({
    onActive: () => {
      setState(SettingsPageState.Main)
    },
  }))

  return (
    <div className="settings h-full flex flex-col">
      <div className="flex-grow p-4">
        {state === SettingsPageState.Main &&
        <SettingsMain onEditSource={() => {
          setState(SettingsPageState.EditSource)
        }} />}

        {state === SettingsPageState.EditSource &&
        <EditSource reload={props.onReload} />}
      </div>
      <SettingsFoot />
    </div>
  )
})
