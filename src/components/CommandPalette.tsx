import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react'
import Fuse from 'fuse.js'

interface Props {
  isHidden: boolean
  isLoading: boolean
  onHide?: () => void
}

export interface CommandPaletteRef {
  target: HTMLDivElement | null
  onKeyDown: (e: KeyboardEvent) => void
}

const DEFAULT_PLACEHOLDER = 'search command'

const commandList = [
  `A Crule Angle's Thesis`,
  'Beautilful World',
  'Hello, World',
  'Komm, Susser, Tod',
  'One Last Kiss',
  'Kokoro yo Genshi ni Modore 2020',
  'Home',
  'I love you more than you\'ll ever know',
  'Komm, Susser Tod',
  'Lucky Orb',
  'Hello my world',
  'Hello, Planet',
  'Highlight',
  'Wow',
  'oh no',
  'anyway'
]

const fuse = new Fuse(commandList)

export const CommandPalette =
forwardRef<CommandPaletteRef, Props>((props, ref) => {
  const { isHidden } = props
  const [commands, setCommands] = useState(commandList)
  const [search, setSearch]     = useState('')
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER)
  const [select, setSelect] = useState(0)
  const commandRef = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    target: commandRef.current,
    onKeyDown: onKeyDown
  }))

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
    setSelect(0)
    setCommands(commandList)
  }, [isHidden])

  useEffect(() => {
    const res = fuse.search(search)
    if (res.length > 0) {
      setCommands(res.map(value => value.item))
    } else if (search.length === 0) {
      setCommands(commandList)
    } else {
      setCommands([])
    }
    setSelect(0)
  }, [search])

  useEffect(() => {
    const element = listRef.current?.children[select]
    element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [select])

  const onKey = useCallback((e: KeyboardEvent) => {
    const input = inputRef.current
    if (!input) return
    setSearch(input.value)
  }, [inputRef])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!inputRef.current) return
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newSelect = (select + commands.length - 1) % commands.length
      setSelect(newSelect)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newSelect = (select + 1) % commands.length
      setSelect(newSelect)
    }

    if (e.key === 'Enter') {
      alert(commands[select])
    }
  }, [commands, inputRef, select])

  return (
    <div className="command-palette fixed top-0 left-1/2 -translate-x-1/2">
      {!isHidden &&
      <div ref={commandRef} className="w-screen h-screen bg-opacity-50
                                     bg-black flex font-light">
        <div className="w-full mx-8 md:mx-auto my-auto mt-56
                        md:w-[500pt] rounded overflow-hidden">
          <input ref={inputRef}
            className="text-mt-0 bg-mbg-1 text-base font-light
                       py-2 px-3 rounded-t w-full outline-none"
            placeholder={placeholder}
            type="text"
            onKeyUp={e => onKey(e.nativeEvent)}
          />
          <div ref={listRef} className="max-h-[336px] bg-mbg-0 overflow-hidden
                                        overflow-y-scroll rounded-b snap-y">
            {commands.map((x, index) => (
              <div key={x} className={`h-[28px] pl-3 overflow-x-auto
                                       select-none flex snap-start
                                       hover:bg-mbg-2 cursor-pointer border-none
                                       active:bg-mbg-0
                                       ${index === select ? 'bg-mbg-2' : ''}`}>
                <span className='my-auto'>{x}</span>
              </div>
            ))}
            {commands.length === 0 && <div className="h-[28px] pl-3 flex">
              <span className='my-auto'>no result...</span>
            </div>}
          </div>
        </div>
      </div>}
    </div>
  )
})
