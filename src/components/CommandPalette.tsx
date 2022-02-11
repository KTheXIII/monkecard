import React, {
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react'
import Fuse from 'fuse.js'
import { BsTerminalFill } from 'react-icons/bs'

const QUOTE_REGEX = /(["'])(?:(?=(\\?))\2.)*?\1/g
const DEFAULT_PLACEHOLDER = 'search command'

const TEST_LIST = [
  'open',
  'add',
  'remove',
  'close',
  'go',
  'search',
]

interface Props {
  onRun(cmd: string, args?: string[]): void
  onInput(input: string): void
  onExpand(cmd: string): void
  onShrink(text: string): void
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
}

const Component = React.forwardRef<CommandPaletteRef, Props>((props, ref) => {
  const { onRun, onInput, onExpand } = props
  const [hint, setHint] = useState(DEFAULT_PLACEHOLDER)
  const [isHidden, setIsHidden] = useState(true)
  const [isInput,  setIsInput ] = useState(false)
  const [commands, setCommands] = useState<string[]>(TEST_LIST)
  const [results,  setResults ] = useState<string[]>(commands)
  const [selected, setSelected] = useState<number>(0)
  const [search,   setSearch  ] = useState<string>('')
  const cmdRef   = useRef<HTMLDivElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fuse = useMemo(() => new Fuse(commands), [commands])

  useImperativeHandle(ref, () => ({
    target: cmdRef.current,
    setHint: setHint,
    setCommands: setCommands,
    onKeyDown: onKeyDown,
    isHidden: () => isHidden,
    setIsHidden: setIsHidden,
    setIsInput: setIsInput,
    isInput: () => isInput,
  }))

  // Reset view into its initial state
  useEffect(() => {
    if (isHidden || !inputRef.current) return
    inputRef.current.focus()

    // Reset to default values
    setIsInput(false)
    setSelected(0)
    setSearch('')
    setResults(commands)
  }, [isHidden, commands])

  // Perform search
  useEffect(() => {
    if (isInput) return  // Skip if input is active
    const res = fuse.search(search.replaceAll(QUOTE_REGEX, '').trim())
    if (res.length > 0) {
      setResults(res.map(({ item }) => item))
      setSelected(0)
    } else if (search.length === 0) {
      setResults(commands)
      setSelected(0)
    } else {
      setResults([])
    }
  }, [isInput, search, fuse, commands])

  useLayoutEffect(() => {
    const element = listRef.current?.children[selected]
    if (!element || isHidden) return
    element.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selected, isHidden])

  const onInputChange = useCallback(() => {
    if (!inputRef.current) return
    setSearch(inputRef.current.value)
  }, [inputRef, setSearch])

  const onRunCommand = useCallback((index: number) => {
    if (!inputRef.current) return
    const input = inputRef.current
    if (isInput) {
      onInput(input.value)
      return
    }
    // TODO: Add support for argument without quotes
    //       e.g. `add "deck" "card"`
    const cmd = results[index]
    const parse = input.value.trim().match(QUOTE_REGEX)
    const args  = parse ? parse.map(s => s.replace(/^["']|['"]$/g, '')) : []
    onRun(cmd, args)
  }, [isInput, results, onRun, onInput])

  const onExpandCommand = useCallback((index: number) => {
    const input = inputRef.current
    if (!input) return
    input.focus()
    const cmd = results[index] + ' '
    input.value = cmd + ' '
    setSearch(cmd)
    onExpand(cmd)
  }, [results, onExpand])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!inputRef.current) return
    switch (e.key) {
    case 'Enter':
      onRunCommand(selected)
      break
    case 'ArrowUp':
      e.preventDefault()
      setSelected(p => (p + results.length - 1) % results.length)
      break
    case 'ArrowDown':
      e.preventDefault()
      setSelected(p => (p + 1) % results.length)
      break
    case 'Tab':
      e.preventDefault()
      onExpandCommand(selected)
      break
    }
  }, [onRunCommand, selected, onExpandCommand, results])

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
              placeholder={hint}
              type="text"
              onChange={_ => onInputChange()}
            />
          </div>
          {!isInput && <div ref={listRef}
            className="max-h-[336px] bg-mbg-base rounded-b-memo overflow-y-auto snap-y scroll-auto">
            {results.map((c, i) => (
              <div key={`${i.toString().padStart(2, '0')}`}
                className={`md:h-[28px] h-10 w-full pl-3 select-none flex snap-start 
                            cursor-pointer border-none active:bg-mbg-active
                            ${i === selected ? 'bg-mbg-active' : 'hover:bg-mbg-hover'}`}
                onClick={_ => onRunCommand(i)}>
                <span className="my-auto overflow-x-auto whitespace-nowrap">{c}</span>
              </div>
            ))}
            {/* {results.length === 0 && commands.length !== 0 &&
            <div className="h-[28px] pl-3 flex">
              <span className='my-auto'>no result...</span>
            </div>
            } */}
          </div>}
        </div>
      </div>
      }
    </div>
  )
})

Component.displayName = 'CommandPalette'
export const CommandPalette = React.memo(Component)
