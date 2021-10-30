import React, {
  ReactElement, useEffect, useState
} from 'react'
import { Circle, CircleFill } from '@assets/BootstrapIcons'

interface MemoListProps {
  text?: string
  className?: string
}

export const MemoList: React.FC<MemoListProps> = (props) => {
  const { text } = props
  const isEmpty = React.Children.count(props.children) === 0

  return (
    <div className="memo-list text-base">
      {text && <div className="memo-list-info p-4">
        <span>{text}</span>
      </div>}
      <div className="memo-list-content grid bg-mbg-1 rounded-memo
                      overflow-hidden">
        {props.children}
      </div>
    </div>
  )
}

export const MemoListItem: React.FC = (props) => {
  return (
    <div className="memo-list-item">
      {props.children}
    </div>
  )
}

interface ButtonItemProps {
  text: string
  preview?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onDrop?: (e: DragEvent) => void
  onDragOver?: (e: DragEvent) => void

  isDisabled?: boolean
  title?: string

  iconL?: ReactElement  // left icon
  iconR?: ReactElement  // right icon
  hideIconL?: boolean   // Default: true
  hideIconR?: boolean   // Default: true
  iconRColor?: string
  iconLColor?: string
}

export const MemoListButtonItem: React.FC<ButtonItemProps> = (props) => {
  const { text, preview } = props

  const hideIconL  = props.hideIconL  === undefined ? true  : props.hideIconL
  const hideIconR  = props.hideIconR  === undefined ? true  : props.hideIconR
  const isDisabled = props.isDisabled === undefined ? false : props.isDisabled
  const iconLStyle = props.iconLColor ? { color: props.iconLColor } : undefined
  const iconRStyle = props.iconRColor ? { color: props.iconRColor } : undefined

  return (
    <button
      className="memo-list-item flex font-light hover:bg-mbg-2 active:bg-mbg-3
                 disabled:bg-mbg-1 disabled:text-mt-2 disabled:cursor-default group"
      disabled={isDisabled}
      title={props.title}
      onClick={e => props.onClick && props.onClick()}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}>
      {!hideIconL && <div className="m-auto pl-4 w-4 h-4"
        style={iconLStyle}>{props.iconL}</div>}
      <div className="flex-grow ml-4 py-4 pr-4
                      border-solid border-b border-mbg-0 group-last:border-b-0">
        <div className="flex m-auto w-full">
          <div className="text-left flex-grow break-words w-0 select-text">
            <span>{text}</span>
          </div>
          {preview && <div
            className="text-right w-1/4 overflow-hidden text-mt-1 pl-4">
            <span>{preview}</span></div>}
          {!hideIconR && <div className="m-auto ml-5 w-4 h-4"
            style={iconRStyle}>{props.iconR}</div>}
        </div>
      </div>
    </button>
  )
}

interface MemoListMarkProps {
  text: string
  preview?: string
  isMarked: boolean
  onMark?: (mark: boolean) => void

  icons?: [ReactElement, ReactElement]
}

export const MemoListMarkItem: React.FC<MemoListMarkProps> = (props) => {
  const [isMarked, setIsMarked] = useState(props.isMarked || false)
  const [ON, OFF] = props.icons || [CircleFill, Circle]

  useEffect(() => {
    setIsMarked(props.isMarked)
  }, [props])

  return (
    <MemoListButtonItem
      text={props.text}
      preview={props.preview}
      hideIconR={false}
      iconR={isMarked ? ON : OFF}
      onClick={() => {
        const mark = !isMarked
        setIsMarked(mark)
        if (props.onMark) props.onMark(mark)
      }}
    />
  )
}
