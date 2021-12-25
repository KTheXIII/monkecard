import React, {
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'
import Fuse from 'fuse.js'
import { TerminalFill } from '@assets/BootstrapIcons'
import { ECommandMode, TCommand } from '@models/command'

const DEFAULT_PLACEHOLDER = 'search command'

interface IRestore {
  fn: () => void
}
interface ICommand {
  fn: TCommand
}

interface Props {
  isHidden: boolean
  isLoading: boolean
  commandList: string[]
  onCommand: TCommand
  onHide: () => void
}

export interface CommandPaletteRef {
  target: HTMLDivElement | null
  onKeyDown: (e: KeyboardEvent) => void
}

export const CommandPalette =
React.forwardRef<CommandPaletteRef, Props>((props, ref) => {
  const { isHidden, onCommand, commandList, onHide } = props
  const [filtered, setFiltered] = useState(commandList)
  const [mode, setMode]         = useState(ECommandMode.Normal)
  const [inputBox, setInputBox] = useState('')
  const [select, setSelect]     = useState(0)
  const [restore, setRestore]   = useState<IRestore>()
  const [command, setCommand]   = useState<ICommand>()
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER)
  const commandRef = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const fuse = useMemo(() => new Fuse(commandList), [commandList])

  useImperativeHandle(ref, () => ({
    target: commandRef.current,
    onKeyDown: onKeyDown
  }))

  // Reset to default value when isHidden changes
  useEffect(() => {
    setSelect(0)
    setMode(ECommandMode.Normal)
    setInputBox('')
    if (isHidden && restore) {
      setPlaceholder(DEFAULT_PLACEHOLDER)
      restore.fn()
      setRestore(undefined)
    }

    if (!inputRef.current) return
    inputRef.current.focus()
  }, [isHidden, restore])

  useEffect(() => {
    if (mode === ECommandMode.Input) return

    const res = fuse.search(inputBox)
    if (res.length > 0) {
      const list = res.map(({ item }) => item)
      setFiltered(list)
      setSelect(0)
      fuse.setCollection(list)
    } else if (inputBox !== '') {
      setFiltered([])
      setSelect(-1)
    } else {
      setFiltered(commandList)
      setSelect(0)
      fuse.setCollection(commandList)
    }
  }, [commandList, fuse, inputBox, mode])

  useEffect(() => {
    const element = listRef.current?.children[select]
    element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [select])

  const onKey = useCallback((e: KeyboardEvent) => {
    const input = inputRef.current
    if (!input) return
    setInputBox(input.value)
  }, [inputRef])

  const onSelectCommand = useCallback((index: number) => {
    if (filtered.length === 0) return
    const cmd = filtered[index]
    const input = inputRef.current
    onCommand(cmd).then(s => {
      if (!s) {  // Handle if s is void
        onHide()
        return
      }
      if (s.success) onHide()
      if (s.fn) setCommand({ fn: s.fn })
      if (s.mode) setMode(s.mode)
      if (s.hint) setPlaceholder(s.hint)
      else setPlaceholder(DEFAULT_PLACEHOLDER)

      if (s.restore) setRestore({ fn: s.restore })
      if (!input) return
      if (s.default) input.value = s.default
      else input.value = ''
      input.focus()
    })
  }, [filtered, onCommand, onHide])

  const onInputEnter = useCallback(() => {
    if (!inputRef.current) return
    command?.fn(inputRef.current.value)
      .then(s => {
        if (!s) onHide()
        if (s && s.success) onHide()
      })
  }, [onHide, command])

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
      case ECommandMode.Input:
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
          <div className="flex bg-mbg-1">
            {mode !== ECommandMode.Input &&
             <div className='p-1 pl-3 pr-0 m-auto'>{TerminalFill}</div>
            }
            <input ref={inputRef}
              className="text-mt-0 bg-mbg-1 md:text-base font-light text-mbase
                         py-2 px-3 w-full outline-none rounded-none"
              placeholder={placeholder}
              type="text"
              onKeyUp={e => onKey(e.nativeEvent)}
            />
            {/* <button className="md:hidden w-16 bg-mbg-2 text-mtext-dim-1">run</button> */}
          </div>
          {mode !== ECommandMode.Input &&
          <div ref={listRef} className="max-h-[336px] bg-mbg-base rounded-b-memo
                                        overflow-y-auto snap-y scroll-auto">
            {filtered.map((cmd, index) => (
              <div key={`${cmd}-${index.toString().padStart(2, '0')}`}
                className={`md:h-[28px] h-10 w-full pl-3 select-none 
                            flex snap-start hover:bg-mbg-hover 
                            cursor-pointer border-none active:bg-mbg-active
                            ${index === select ? 'bg-mbg-active' : ''}`}
                onClick={_ => onSelectCommand(index)}>
                <span className="my-auto overflow-x-auto whitespace-nowrap">{cmd}</span>
              </div>
            ))}
            {filtered.length === 0 && commandList.length !== 0 &&
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
