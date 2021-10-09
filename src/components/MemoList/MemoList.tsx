import React, { ReactElement } from 'react'

interface MemoListProps {
  text?: string
  emptyMessage?: string
}

export const MemoList: React.FC<MemoListProps> = (props) => {
  const { text, emptyMessage } = props
  const isEmpty = React.Children.count(props.children) === 0
  return (
    <div className="memo-list">
      {text && <div className="memo-list-info">
        <span>{text}</span>
      </div>}
      <div className="memo-list-content">
        {isEmpty && <div className="memo-list-empty">{emptyMessage}</div>}
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
  iconStyleL?: string
  iconStyleR?: string
}

export const MemoListButtonItem: React.FC<ButtonItemProps> = (props) => {
  const { text, preview } = props

  const hideIconL  = props.hideIconL  === undefined ? true  : props.hideIconL
  const hideIconR  = props.hideIconR  === undefined ? true  : props.hideIconR
  const isDisabled = props.isDisabled === undefined ? false : props.isDisabled

  return (
    <button
      className="memo-list-item"
      disabled={isDisabled}
      title={props.title}
      onClick={e => props.onClick && props.onClick()}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}>
      {!hideIconL && <div className="icon-left" >{props.iconL}</div>}
      <div className="memo-list-item-content">
        <div className="memo-list-display">
          <div className="text">
            <span>{text}</span>
          </div>
          {preview && <div className="preview"><span>{preview}</span></div>}
          {!hideIconR && <div className="icon-right" >{props.iconR}</div>}
        </div>
      </div>
    </button>
  )
}
