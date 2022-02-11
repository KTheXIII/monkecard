import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import {
  BsCircleFill, BsCircle, BsXCircle
} from 'react-icons/bs'

interface MemoListProps {
  text?: string
  className?: string
}

export const MemoList: React.FC<MemoListProps> = (props) => {
  const { text } = props
  // const isEmpty = React.Children.count(props.children) === 0

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
      className="memo-list-item flex font-light
                 hover:bg-mbg-2 active:bg-mbg-3
                 disabled:bg-mbg-1 disabled:text-mtext-dim-2
                 disabled:cursor-default group"
      disabled={isDisabled}
      title={props.title}
      onClick={e => props.onClick && props.onClick()}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}>
      {!hideIconL && <div className="ml-4 m-auto w-4 h-4"
        style={iconLStyle}>{props.iconL}</div>}
      <div className="flex-grow ml-4 py-4 pr-4
                      border-solid border-b
                      border-mbg-base group-last:border-b-0">
        <div className="flex m-auto w-full">
          <div className="text-left flex-grow break-all
                          select-text w-0 m-auto">
            {text}
          </div>
          {preview &&
          <div className="text-right w-1/4 text-mtext-dim-1 m-auto
                          whitespace-nowrap overflow-hidden">
            <span>{preview}</span>
          </div>}
          {!hideIconR && <div className="m-auto ml-4 w-[16px]"
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
  const [ON, OFF] = props.icons || [<BsCircleFill />, <BsCircle />]

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

interface MemoListInputTextProps {
  defaultText?: string
  placeholder?: string
  onChange?: (text: string) => void
  onConfirm?: (text: string) => void
  onCancel?: () => void
}

export const MemoListInputText: React.FC<MemoListInputTextProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null)
  const onDone = useCallback(() => {
    const input = ref.current
    if (input) {
      const text = input.value.trim()
      if (props.onConfirm) props.onConfirm(text)
    }
  }, [props, ref])

  useEffect(() => {
    const input = ref.current
    if (input) input.focus()
  }, [])

  return (
    <div className="pl-4 flex pr-2">
      <input type="text"
        ref={ref}
        className="py-4 pr-3 bg-mbg-1 w-full h-full overflow-hidden
                   outline-none border-none text-memo md:text-base font-light
                   placeholder-mt-1"
        defaultValue={props.defaultText}
        placeholder={props.placeholder}
        onChange={e => props.onChange && props.onChange(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter')
            onDone()
        }}
      />
      <button className="m-auto bg-mbg-0 rounded-mfull mr-2
                        hover:bg-mbg-2 active:bg-mbg-3 text-mred"
      onClick={props.onCancel}>
        <div className="w-6 h-6 m-2">{<BsXCircle />}</div>
      </button>
      <button className="m-auto bg-mbg-0 rounded-mfull mr-2 last:mr-0
                        hover:bg-mbg-2 active:bg-mbg-3 text-mgreen"
      onClick={onDone}>
        <div className="w-6 h-6 m-2">{<BsCircle />}</div>
      </button>
    </div>
  )
}

interface SwitchITPProps {
  text: string
  preview?: string
  onConfirm?: (text: string) => void
  iconL?: ReactElement
  iconR?: ReactElement
}

export const MemoListSwitchITP: React.FC<SwitchITPProps> = (props) => {
  const [isInput, setIsInput] = useState(false)
  return isInput ?
    <MemoListInputText
      defaultText={props.preview || props.text}
      onConfirm={text => {
        setIsInput(false)
        if (props.onConfirm) props.onConfirm(text)
        console.log(text)
      }}
      onCancel={() => setIsInput(false)} />
    :
    <MemoListButtonItem
      iconL={props.iconL}
      iconR={props.iconR}
      hideIconL={props.iconL === undefined}
      hideIconR={props.iconR === undefined}
      text={props.text}
      preview={props.preview}
      onClick={() => setIsInput(true)}
    />
}
