import {
  h,
  FunctionalComponent as Func,
  toChildArray,
  VNode,
} from 'preact'
import { useRef, useEffect } from 'preact/hooks'

interface MemoListProps {
  text?: string
  emptyMessage?: string
}

export const MemoList: Func<MemoListProps> = (props) => {
  const { text, emptyMessage } = props
  const isEmpty = toChildArray(props.children).length === 0
  return (
    <div class="memo-list">
      {text && <div class="memo-list-info">
        <span>{text}</span>
      </div>}
      <div class="memo-list-content">
        {isEmpty && <div class="memo-list-empty">{emptyMessage}</div>}
        {props.children}
      </div>
    </div>
  )
}

export const MemoListItem: Func = (props) => {
  return (
    <div class="memo-list-item">
      {props.children}
    </div>
  )
}

interface ButtonItemProps {
  text: string
  preview?: string
  onClick?: () => void
  onMouseEnter?: () => void
  isDisabled?: boolean
  title?: string

  iconL?: VNode         // left icon
  iconR?: VNode         // right icon
  hideIconL?: boolean   // Default: true
  hideIconR?: boolean   // Default: true
  iconStyleL?: string
  iconStyleR?: string
  preDefault?: boolean  // Prevent default on click, default: true
}

export const MemoListButtonItem: Func<ButtonItemProps> = (props) => {
  const { text, preview } = props
  const btnRef = useRef<HTMLButtonElement>(null)

  const prevent    = props.preDefault === undefined ? true  : props.preDefault
  const hideIconL  = props.hideIconL  === undefined ? true  : props.hideIconL
  const hideIconR  = props.hideIconR  === undefined ? true  : props.hideIconR
  const isDisabled = props.isDisabled === undefined ? false : props.isDisabled

  return (
    <button
      class="memo-list-item"
      ref={btnRef}
      disabled={isDisabled}
      title={props.title}
      onClick={e => {
        // if (prevent) e.preventDefault()
        if (props.onClick) props.onClick()
      }}
      onMouseEnter={props.onMouseEnter}>
      {!hideIconL && <div class="icon-left" style={props.iconStyleL}>{props.iconL}</div>}
      <div class="memo-list-item-content">
        <div class="memo-list-display">
          <div class="text"><span>{text}</span></div>
          <div class="preview"><span>{preview}</span></div>
          {!hideIconR && <div class="icon-right" style={props.iconStyleR}>{props.iconR}</div>}
        </div>
      </div>
    </button>
  )
}
