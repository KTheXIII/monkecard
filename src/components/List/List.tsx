import React, {
  useState,
  ReactElement,
  useRef,
  useEffect,
  useCallback
} from 'react'
import {
  ChevronRight,
  Circle,
  CircleFill,
  XCircle
} from '@assets/BootstrapIcons'

interface IListComponent {
  header?: string
}

export const ListComponent: React.FC<IListComponent> = (props) => {
  const { header } = props
  return (
    <div className="list__component">
      {header && <div className="list__header">{header}</div>}
      <div className="list__body">
        {props.children}
      </div>
    </div>
  )
}

interface IListItem {
  text: string
  icon?: ReactElement
  hideIcon?: boolean
  hideRightIcon?: boolean
}

export const ListItemText: React.FC<IListItem> = (props) => {
  const hideIcon = props.hideIcon || false
  return (
    <div className="list__item">
      {!hideIcon && <div className="icon">
        {props.icon}
      </div>}
      <div className="container">
        <div className="display">
          <span className="text">{props.text}</span>
        </div>
      </div>
    </div>
  )
}

interface IListItemButton {
  text: string
  preview?: string
  onButton?: () => void
  isEnable?: boolean

  iconL?: ReactElement
  iconR?: ReactElement
  hideIconL?: boolean
  hideIconR?: boolean
}

export const ListItemButton: React.FC<IListItemButton> = (props) => {
  const hideIconL = props.hideIconL || false
  const hideIconR = props.hideIconR || false

  const iconL = props.iconL
  const iconR = props.iconR || ChevronRight

  const isEnable = props.isEnable !== undefined ? props.isEnable : true
  return (
    <button
      disabled={!isEnable}
      className="list__item"
      onClick={props.onButton}>
      {!hideIconL && <div className="icon">{iconL}</div>}
      <div className="container">
        <div className="display">
          <div className="text"><span>{props.text}</span></div>
          <div className="preview"><span>{props.preview}</span></div>
          {!hideIconR && <div className="right-icon">
            <div>{iconR}</div>
          </div>}
        </div>
      </div>
    </button>
  )
}

interface IListItemInputText {
  default?: string
  placeholder?: string
  isFocus?: boolean
  onChange?: (text: string) => void
  onConfirm?: (text: string) => void
  onCancel?: () => void
}

export const ListItemInputText: React.FC<IListItemInputText> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const onDone = useCallback(() => {
    if (!inputRef.current) return
    const text = inputRef.current.value.trim()
    if (text.length > 0 && props.onConfirm)
      props.onConfirm(text)
  }, [inputRef])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  return (
    <div className="list__item">
      <input
        type="text"
        ref={inputRef}
        defaultValue={props.default}
        placeholder={props.placeholder}
        onChange={(e) => {
          if (props.onChange) props.onChange(e.target.value)
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter') onDone()
        }}
      />
      <div className="options">
        <button title="Cancel" className="cancel" onClick={props.onCancel}>
          <div className="icon">{XCircle}</div>
        </button>
        <button title="Confirm" className="confirm" onClick={onDone}>
          <div className="icon">{Circle}</div>
        </button>
      </div>
    </div>
  )
}

interface IListItemMark {
  text: string
  preview?: string
  isMarked: boolean
  onMark: (mark: boolean) => void

  stateLorR?: boolean                   // false: left, true: right
  icons?: [ReactElement, ReactElement]  // [ON, OFF]
  icon?: ReactElement
  hideIconL?: boolean
  hideIconR?: boolean
}

export const ListItemMark: React.FC<IListItemMark> = (props) => {
  const [isMarked, setIsMarked] = useState(props.isMarked || false)
  const [ON, OFF] = props.icons || [CircleFill, Circle]
  const lor = props.stateLorR || false
  return (
    <ListItemButton
      text={props.text}
      preview={props.preview}
      iconL={!lor ? isMarked ? ON : OFF : props.icon}
      hideIconL={props.hideIconL}
      iconR={lor ? isMarked ? ON : OFF : props.icon}
      hideIconR={props.hideIconR}
      onButton={() => {
        const mark = !isMarked
        setIsMarked(mark)
        props.onMark(mark)
      }}
    />
  )
}

interface IListItemInputSwitch {
  text: string
  isInput?: boolean
  preview?: string
  onConfirm?: (value: string) => void
  icon?: ReactElement
  isEnable?: boolean
}

export const ListItemInputSwitch: React.FC<IListItemInputSwitch> = (props) => {
  const [isInput, setIsInput] = useState(props.isInput || false)
  const isEnable = props.isEnable !== undefined ? props.isEnable : true

  return isInput ?
    <ListItemInputText
      default={props.preview}
      onConfirm={(text) => {
        if (props.onConfirm) props.onConfirm(text)
        setIsInput(false)
      }}
      onCancel={() => setIsInput(false)}
    />
    :
    <ListItemButton
      isEnable={isEnable}
      iconL={props.icon}
      text={props.text}
      preview={props.preview}
      onButton={() => setIsInput(true)}
    />
}
