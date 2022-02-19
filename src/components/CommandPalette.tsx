import React, {
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react'
import { BsTerminalFill } from 'react-icons/bs'

interface Props {
  onRun(cmd: string): void
  onEval(text: string): void
  onInput(input: string): void
  onExpand(cmd: string): void
}

export interface CommandPaletteRef {
  target: HTMLDivElement | null
  setHint(text: string): void
  setCommands(cmds: string[]): void
  onKeyDown(e: KeyboardEvent): void
  isHidden(): boolean
  setIsHidden(isHidden: boolean): void
  setIsInput(isInput: boolean): void
  isInput(): boolean
  setMessage(text: string): void
  setSearch(text: string): void
}

const Component = React.forwardRef<CommandPaletteRef, Props>((props, ref) => {
  const { onRun, onEval, onInput, onExpand } = props
  const [hint, setHint] = useState('')
  const [isHidden, setIsHidden] = useState(true)
  const [isInput,  setIsInput ] = useState(false)
  const [commands, setCommands] = useState<string[]>([])
  const [selected, setSelected] = useState<number>(0)
  const [search,   setSearch  ] = useState<string>('')
  const [message,  setMessage ] = useState<string>('')
  const cmdRef   = useRef<HTMLDivElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // const fuse = useMemo(() => new Fuse(commands), [commands])

  useImperativeHandle(ref, () => ({
    target: cmdRef.current,
    setHint: setHint,
    setCommands: setCommands,
    onKeyDown: onKeyDown,
    isHidden: () => isHidden,
    setIsHidden: setIsHidden,
    setIsInput: setIsInput,
    isInput: () => isInput,
    setMessage: setMessage,
    setSearch: setSearch,
  }))

  useEffect(() => {
    if (isHidden) return
    onEval('')
    setSelected(0)
    setSearch('')
    setIsInput(false)
  }, [isHidden, onEval])

  // Reset view into its initial state
  useEffect(() => {
    if (isHidden || !inputRef.current) return
    inputRef.current.focus()
  }, [isHidden])

  useEffect(() => {
    if (isHidden || !inputRef.current) return
    inputRef.current.value = search
  }, [isHidden, search])

  useLayoutEffect(() => {
    const element = listRef.current?.children[selected]
    if (!element || isHidden) return
    element.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selected, isHidden])

  const onInputChange = useCallback(() => {
    if (!inputRef.current) return
    setSearch(inputRef.current.value)
    onEval(inputRef.current.value)
  }, [onEval])

  const onRunCommand = useCallback((index: number) => {
    if (!inputRef.current) return
    const input = inputRef.current
    if (isInput)
      onInput(input.value)
    else if (index > -1 && index < commands.length)
      onRun(commands[index])
  }, [isInput, onInput, onRun, commands])

  const onExpandCommand = useCallback((index: number) => {
    const input = inputRef.current
    if (!input) return
    const cmd = commands[index]
    input.value = cmd
    setSearch(cmd)
    onExpand(cmd)
  }, [commands, onExpand])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!inputRef.current) return
    switch (e.code) {
    case 'Enter':
      onRunCommand(selected)
      break
    case 'ArrowUp':
      e.preventDefault()
      setSelected(p => (p + commands.length - 1) % commands.length)
      break
    case 'ArrowDown':
      e.preventDefault()
      setSelected(p => (p + 1) % commands.length)
      break
    case 'Tab':
      e.preventDefault()
      inputRef.current.focus()
      onExpandCommand(selected)
      break
    }
  }, [onRunCommand, selected, onExpandCommand, commands])

  return (
    <div className="fixed top-0 left-0">
      {!isHidden &&
      <div ref={cmdRef} className="w-screen h-screen bg-opacity-50 bg-black flex font-light">
        <div className="w-full mx-5 md:mx-auto md:mt-56 mt-8 mb-auto shadow-memo
                        md:w-[500pt] rounded-memo overflow-hidden">
          <div className="flex bg-mbg-1 px-3 space-x-3">
            <div className='my-auto'> <BsTerminalFill /></div>
            <input ref={inputRef}
              className="bg-mbg-1 md:text-base font-light text-memo py-2 w-full outline-none rounded-none"
              autoCapitalize='off'
              autoComplete='off'
              autoCorrect='off'
              placeholder={hint}
              type="text"
              onChange={_ => onInputChange()}
            />
          </div>
          {!isInput &&
            <div ref={listRef}
              className="max-h-[336px] bg-mbg-base rounded-b-memo overflow-y-auto snap-y scroll-auto">
              {commands.map((c, i) => (
                <div key={`${i.toString(16).padStart(2, '0')}`}
                  className={`md:h-[28px] h-10 w-full pl-3 select-none flex snap-start 
                            cursor-pointer border-none active:bg-mbg-active
                            ${i === selected ? 'bg-mbg-active' : 'hover:bg-mbg-hover'}`}
                  onClick={_ => onRunCommand(i)}>
                  <span className="my-auto overflow-x-auto whitespace-nowrap">{c}</span>
                </div>
              ))}
              {commands.length === 0 && message &&
                <div className="h-[28px] pl-3 flex">
                  <span className='my-auto'>{message}</span>
                </div>
              }
            </div>}
        </div>
      </div>
      }
    </div>
  )
})

Component.displayName = 'CommandPalette'
export const CommandPalette = React.memo(Component)
