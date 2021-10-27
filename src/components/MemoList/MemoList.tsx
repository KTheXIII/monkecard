import React, { ReactElement, useState } from 'react'
import { Circle, CircleFill } from '@assets/BootstrapIcons'

interface MemoListProps {
  text?: string
  className?: string
}

export const MemoList: React.FC<MemoListProps> = (props) => {
  const { text } = props
  const isEmpty = React.Children.count(props.children) === 0

  return (
    <div className="memo-list">
      {text && <div className={`memo-list-info ${props.className}`}>
        <span>{text}</span>
      </div>}
      <div className="memo-list-content">
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
      className="memo-list-item"
      disabled={isDisabled}
      title={props.title}
      onClick={e => props.onClick && props.onClick()}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}>
      {!hideIconL && <div className="icon-left" style={iconLStyle}>{props.iconL}</div>}
      <div className="memo-list-item-content">
        <div className="memo-list-display">
          <div className="text">
            <span>{text}</span>
          </div>
          {preview && <div className="preview"><span>{preview}</span></div>}
          {!hideIconR && <div className="icon-right" style={iconRStyle}>{props.iconR}</div>}
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
