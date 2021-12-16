import React, {
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react'
import Fuse from 'fuse.js'

import {
  ECommandType,
  ICommandNormal,
  ICommandBase,
  ICommandInput,
  ICommandOption
} from '@models/command'

const DEFAULT_PLACEHOLDER = 'search command'
const FUSE_OPTIONS: Fuse.IFuseOptions<ICommandBase> = {
  keys: ['name'],
}

interface Props {
  isHidden: boolean
  isLoading: boolean
  commands: ICommandBase[]
  onHide?: () => void
}
export interface CommandPaletteRef {
  target: HTMLDivElement | null
  onKeyDown: (e: KeyboardEvent) => void
}

export const CommandPalette =
React.forwardRef<CommandPaletteRef, Props>((props, ref) => {
  const { isHidden } = props
  const [commands, setCommands] = useState<ICommandBase[]>(props.commands)
  const [filtered, setFiltered] = useState<ICommandBase[]>(commands)
  const [fuse, setFuse]         = useState(new Fuse(filtered, FUSE_OPTIONS))
  const [mode, setMode]         = useState(ECommandType.Normal)
  const [inputBox, setInputBox] = useState('')
  const [select, setSelect]     = useState(0)
  const [command, setCommand]   = useState<ICommandBase | null>(null)
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER)
  const commandRef = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    target: commandRef.current,
    onKeyDown: onKeyDown
  }))

  // Reset to default value when isHidden changes
  useEffect(() => {
    setSelect(0)
    setCommands(props.commands)
    setCommand(null)
    setPlaceholder(DEFAULT_PLACEHOLDER)
    setMode(ECommandType.Normal)
    setInputBox('')

    if (!inputRef.current) return
    inputRef.current.focus()
  }, [isHidden, props])

  useEffect(() => {
    if (mode === ECommandType.Input) return

    const res = fuse.search(inputBox)
    if (res.length > 0) {
      setFiltered(res.map(value => value.item))
      setSelect(0)
    } else if (inputBox === '') {
      setFiltered(commands)
      setSelect(0)
    } else if (res.length === 0) {
      setFiltered([])
      setSelect(-1)
    }
  }, [inputBox, fuse, commands, mode])

  useEffect(() => {
    const element = listRef.current?.children[select]
    element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [select])

  useEffect(() => {
    setFiltered(commands)
    setFuse(new Fuse(commands, FUSE_OPTIONS))
  }, [commands])

  const onKey = useCallback((e: KeyboardEvent) => {
    const input = inputRef.current
    if (!input) return
    setInputBox(input.value)
  }, [inputRef])

  const onSelectCommand = useCallback((index: number) => {
    if (mode === ECommandType.Input ||
        index < 0 || !inputRef.current) return

    const cmd = filtered[index]
    switch (cmd.type) {
    case ECommandType.Normal: {
      (cmd as ICommandNormal).fn()
      props.onHide?.()
      break
    }
    case ECommandType.Option: {
      const option = (cmd as ICommandOption)
      setPlaceholder(option.hint)
      inputRef.current.value = ''
      console.log(option.list)

      setCommands(option.list().map(item => ({
        type: ECommandType.Normal,
        name: item,
        fn:() => option.fn(item)
      } as ICommandNormal)))
      setMode(ECommandType.Option)
      break
    }
    case ECommandType.Input: {
      const input = (cmd as ICommandInput)
      setCommand(input)
      setPlaceholder(input.hint)
      inputRef.current.value = ''
      setMode(ECommandType.Input)
      inputRef.current.focus()
      break
    }
    }
  }, [mode, filtered, props])

  const onInputEnter = useCallback(() => {
    if (!command || !inputRef.current) return
    const cmd = command as ICommandInput
    cmd.fn(inputRef.current.value)
    props.onHide?.()
    setCommand(null)
  }, [command, inputRef, props])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!inputRef.current) return
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newSelect = (select + filtered.length - 1) % filtered.length
      setSelect(newSelect)
      return
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newSelect = (select + 1) % filtered.length
      setSelect(newSelect)
      return
    }

    if (e.key === 'Enter') {
      switch (mode) {
      case ECommandType.Input:
        onInputEnter()
        break
      default:
        onSelectCommand(select)
      }
    }
  }, [select, filtered, mode, onInputEnter, onSelectCommand])

  return (
    <div className="command-palette fixed top-0 left-1/2 -translate-x-1/2">
      {!isHidden &&
      <div ref={commandRef} className="w-screen h-screen bg-opacity-50
                                     bg-black flex font-light">
        <div className="w-full mx-5 md:mx-auto md:mt-56 mt-8 mb-auto
                        md:w-[500pt] rounded-memo overflow-hidden">
          <div className="flex">
            <input ref={inputRef}
              className="text-mt-0 bg-mbg-1 md:text-base font-light text-mbase
                       py-2 px-3 w-full outline-none rounded-none"
              placeholder={placeholder}
              type="text"
              onKeyUp={e => onKey(e.nativeEvent)}
            />
            {/* <button className="md:hidden w-16 bg-mbg-2 text-mtext-dim-1">run</button> */}
          </div>
          {mode !== ECommandType.Input &&
          <div ref={listRef} className="max-h-[336px] bg-mbg-base rounded-b-memo
                                        overflow-y-scroll snap-y scroll-auto">
            {filtered.map((x, index) => (
              <div key={x.name}
                className={`md:h-[28px] h-10 w-full pl-3 select-none 
                            flex snap-start hover:bg-mbg-hover 
                            cursor-pointer border-none active:bg-mbg-active
                            ${index === select ? 'bg-mbg-active' : ''}`}
                onClick={_ => onSelectCommand(index)}>
                <span className="my-auto overflow-x-scroll whitespace-nowrap">{x.name}</span>
              </div>
            ))}
            {filtered.length === 0 && commands.length != 0 &&
            <div className="h-[28px] pl-3 flex">
              <span className='my-auto'>no result...</span>
            </div>
            }
          </div>
          }
        </div>
      </div>
      }
    </div>
  )
})
