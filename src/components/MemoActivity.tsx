import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { IActivity } from '@models/user'

const Day: React.FC<{data: IActivity, color: number}> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.setProperty('background-color', `#${props.color.toString(16)}`)
    ref.current.setAttribute('data-date', props.data.date.toLocaleDateString('en-SE'))
    ref.current.setAttribute('data-count', props.data.count.toString())
    ref.current.setAttribute('data-active', props.data.active.toString())
  }, [ref, props])
  return (
    <div ref={ref} className="day w-[10px] h-[10px] rounded-sm
                              mb-[3px] last:m-0">
    </div>
  )
}
interface IWeek {
  activities: IActivity[],
  colors: [number, number],
}
const Week: React.FC<IWeek> = (props) => {
  const { activities, colors } = props
  return (
    <div className='flex flex-col mr-[3px] last:mr-0 snap-start justify-start'>
      {activities.map((data, i) => <Day data={data} key={i}
        color={interpolate(colors[0], colors[1], data.active)} />)}
    </div>
  )
}

interface MemoActivityProps {
  activities: IActivity[]
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
  const { activities, colors } = props
  const colorLevels = useMemo(() => {
    return Array(5).fill(0).map((_, i) => {
      const ratio = i / 4
      return interpolate(colors[0], colors[1], ratio)
    })
  }, [colors])
  const weeks = useMemo(() => {
    let dayCount = 0
    return activities.reduce((acc, day, i, arr) => {
      dayCount++
      if (day.date.getDay() === 1) {  // monday as first day of week
        acc.push(arr.slice(i, i + dayCount))
        dayCount = 0
      }
      return acc
    }, [] as IActivity[][])
      .map((week, i) => <Week activities={week} key={i} colors={colors} />)
  }, [activities, colors])
  const [dataDate, setDataDate]   = useState<string | null>(null)
  const [dataCount, setDataCount] = useState<string | null>(null)

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
      const dateString = target.getAttribute('data-date')
      const countString = target.getAttribute('data-count')
      setDataCount(countString)
      setDataDate(dateString)
    }
  }, [toolRef])

  const onMouseLeave = useCallback(() => {
    toolRef.current?.style.setProperty('display', 'none')
  }, [toolRef])

  useEffect(() => {
    if (!ref.current) return
    const div = ref.current
    toolRef.current?.style.setProperty('display', 'none')
    div.addEventListener('mouseover', onMouseOver)
    div.addEventListener('mouseleave', onMouseLeave)
    return () => {
      div.removeEventListener('mouseover', onMouseOver)
      div.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseOver, onMouseLeave, ref, toolRef])

  return (
    <div className="bg-mbg-1 px-3 pb-2 pt-3 m-auto rounded">
      <div ref={ref} className="flex m-1
                                overflow-auto snap-x">
        <div ref={toolRef} className='absolute py-1 px-2 rounded
                                      after:-ml-[5px] after:border-[5px] after:border-solid
                                      after:top-full after:left-1/2 after:absolute
                                      after:border-t-mbg-3 after:border-transparent
                                      bg-mbg-3 -translate-x-1/2 hidden'>
          <span className='text-sm'>
            {dataCount} sessions on {dataDate}
          </span>
        </div>
        {weeks}
      </div>
      <div className='flex text-sm justify-end text-mtext-dim-1'>
        <span className='mr-2'>less</span>
        <div className='flex'>
          {colorLevels.map((color, i) => (
            <span key={i}
              className="h-[10px] w-[10px] rounded-sm
                         mr-[3px] my-auto last:mr-0"
              style={{ backgroundColor: `#${color.toString(16)}` }} />
          ))}
        </div>
        <span className='ml-2'>more</span>
      </div>
    </div>
  )
}
