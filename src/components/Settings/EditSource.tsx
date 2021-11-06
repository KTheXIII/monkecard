import React, {
  useCallback, useEffect, useState
} from 'react'

import { MemoList, MemoListSwitchITP } from '@components/MemoList'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'

interface Props {
  reload: () => void
}

export const EditSource: React.FC<Props> = (props) => {
  const [sources, setSources] = useState<string[]>([])

  async function load() {
    const sources = await getLocalSourceList()
    setSources(sources)
  }

  const onSave = useCallback(async (source: string, index: number) => {
    sources[index] = source
    setSources(sources)
    await saveLocalSourceList(sources)
    load()
    props.reload()
  }, [sources, props])

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <MemoList text="sources">
        {sources.map((source, index) => (
          <MemoListSwitchITP
            key={index + source}
            text={source}
            onConfirm={(text) => {
              onSave(text, index)
            }} />
        ))}
      </MemoList>
    </>
  )
}
