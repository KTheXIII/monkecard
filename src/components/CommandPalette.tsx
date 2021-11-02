import React, {
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react'

interface Props {
  isHidden: boolean
  isLoading: boolean
}

export interface CommandPaletteRef {
  target: HTMLDivElement | null
}

export const CommandPalette = forwardRef<
  CommandPaletteRef,
  Props
>((props, ref) => {
  const commandRef = useRef<HTMLDivElement>(null)
  const { isHidden } = props

  useImperativeHandle(ref, () => ({
    target: commandRef.current
  }))

  return (
    <div className="command-palette fixed top-0 left-1/2 -translate-x-1/2">
      {!isHidden &&
      <div ref={commandRef}
        className="bg-mblue p-[5pt] w-64 rounded-memo">
      </div>}
    </div>
  )
})
