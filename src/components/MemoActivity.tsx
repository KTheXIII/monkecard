import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

const Day: React.FC<{active: number, color: number}> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.setProperty('background-color', `#${props.color.toString(16)}`)
  }, [ref, props])
  return (
    <div ref={ref} className="day w-[10px] h-[10px] rounded-sm
                              mb-[3px] last:m-0">
    </div>
  )
}

const Week: React.FC<{activties: number[], colors: number[]}> = (props) => {
  const { activties, colors } = props
  return (
    <div className='flex-row ml-[3px] last:ml-0 snap-start'>
      {activties.map((active, i) => <Day active={active} key={i}
        color={colors[Math.floor(active * colors.length)]} />)}
    </div>
  )
}

interface MemoActivityProps {
  activties: number[]
  colors: [number, number]
}

/**
 * Linear interpolation
 * @param colorA Hex color
 * @param colorB Hex color
 * @param ratio Interpolation ratio
 * @returns Interpolated hex color
 */
function interpolate(colorA: number, colorB: number, ratio: number) {
  const ar = (colorA >> 16) & 0xFF
  const ag = (colorA >> 8)  & 0xFF
  const ab = colorA & 0xFF
  const br = (colorB >> 16) & 0xFF
  const bg = (colorB >> 8)  & 0xFF
  const bb = colorB & 0xFF
  return ((br - ar) * ratio + ar) << 16 |  // red
         ((bg - ag) * ratio + ag) << 8  |  // green
         ((bb - ab) * ratio + ab)          // blue
}

export const MemoActivity: React.FC<MemoActivityProps> = (props) => {
  const { activties, colors } = props
  const colorLevels = useMemo(() => {
    return Array(5).fill(0).map((_, i) => {
      const ratio = i / 4
      return interpolate(colors[0], colors[1], ratio)
    })
  }, [colors])

  const weeks = useMemo(() => activties.reduce((acc, week, i, arr) => {
    if (i % 7 === 0)
      acc.push(arr.slice(i, i + 7))
    return acc
  }, [] as number[][]).reverse()
    .map((week, i) => <Week activties={week} key={i} colors={colorLevels} />)
  , [activties, colorLevels])
  const ref = useRef<HTMLDivElement>(null)
  const toolRef = useRef<HTMLDivElement>(null)

  const onMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLDivElement
    if (!target) return
    if (target.classList[0] === 'day') {
      const rect = target.getBoundingClientRect()
      toolRef.current?.style.setProperty('top', `${rect.top - 35}px`)
      toolRef.current?.style.setProperty('left', `${rect.left + 5}px`)
      toolRef.current?.style.setProperty('display', 'block')
    }
  }, [toolRef])

  const onMouseLeave = useCallback(() => {
    toolRef.current?.style.setProperty('display', 'none')
  }, [toolRef])

  useEffect(() => {
    if (!ref.current) return
    const div = ref.current
    div.addEventListener('mouseover', onMouseOver)
    div.addEventListener('mouseleave', onMouseLeave)
    return () => {
      div.removeEventListener('mouseover', onMouseOver)
      div.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseOver, onMouseLeave])

  return (
    <div className="bg-mbg-1 px-3 pb-3 pt-3 m-auto rounded">
      <div ref={ref} className="flex flex-row-reverse m-1
                                overflow-auto snap-x">
        <div ref={toolRef} className='absolute py-1 px-2 rounded
                                      after:-ml-[5px] after:border-[5px] after:border-solid
                                      after:top-full after:left-1/2 after:absolute
                                      after:border-t-mbg-3 after:border-transparent
                                      bg-mbg-3 -translate-x-1/2'>
          <span>
            hello
          </span>
        </div>
        {weeks}
      </div>
    </div>
  )
}
