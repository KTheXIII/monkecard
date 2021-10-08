import { h, FunctionalComponent as Func } from 'preact'
import { useState, useEffect } from 'preact/hooks'

import {
  MemoList,
  MemoListButtonItem
} from './MemoList'

import { ChevronRight } from '@assets/BootstrapIcons'

interface CollectionListProps {
  linkList: string[]
}

export const CollectionList: Func<CollectionListProps> = (props) => {
  const [show, setShow] = useState(false)
  return (
    <div class="memo-collection-list">
      <div className="content">
        <MemoList text="collections">
          <MemoListButtonItem text="Hello, World!" onClick={() => {
            setShow(!show)
          }} preview={`${show}`} />
          <MemoListButtonItem text="Hatsune Miku!" />
          <MemoListButtonItem
            text="System Development and Project" preview="Sonokai Andremeda Dark"
            iconR={ChevronRight} hideIconR={false} />
        </MemoList>
      </div>
    </div>
  )
}
