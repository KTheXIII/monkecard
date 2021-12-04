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
}

const commandList = [
  `A Crule Angle's Thesis`,
  'Beautilful World',
  'Hello, World',
  'Komm, Susser, Tod',
  'One Last Kiss',
  'Kokoro yo Genshi ni Modore 2020',
]

const fuse = new Fuse(commandList)

export const CommandPalette =
forwardRef<CommandPaletteRef, Props>((props, ref) => {
  const [commands, setCommands] = useState(commandList)
  const commandRef = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const { isHidden } = props

  useImperativeHandle(ref, () => ({
    target: commandRef.current
  }))

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }, [isHidden])

  const onKey = useCallback((e: KeyboardEvent) => {
    const input = inputRef.current
    if (!input) return
    const res = fuse.search(input.value)
    if (res.length > 0)
      setCommands(res.map(value => value.item))
    else
      setCommands(commandList)
  }, [])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      // TODO: Run the first command in the list
      return
    }
  }, [inputRef])

  return (
    <div className="command-palette fixed top-0 left-1/2 -translate-x-1/2">
      {!isHidden &&
      <div ref={commandRef} className="w-screen h-screen bg-opacity-50 bg-black flex">
        <div className="w-full mx-8 md:mx-auto bg-mbg-0 my-auto mt-56
                        md:w-[500pt] rounded overflow-hidden">
          <input ref={inputRef}
            className="text-mt-0 bg-mbg-1 text-base font-light
                       py-2 px-3 rounded w-full outline-none"
            // defaultValue=">"
            type="text"
            onKeyUp={e => onKey(e.nativeEvent)}
            onKeyDown={e => onKeyDown(e.nativeEvent)}
          />
          <div className="max-h-[280pt] overflow-hidden overflow-y-scroll scroll-snap-y">
            {commands.map(x => (
              <div key={x} className="py-1 px-3 last:border-0 border-b-[1px]
                    select-none scroll-snap-align-start
                    border-mbg-1 hover:bg-mbg-2 cursor-pointer
                    active:bg-mbg-0">
                <span>{x}</span>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  )
})
