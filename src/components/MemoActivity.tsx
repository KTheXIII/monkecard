import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { IActivity } from '@models/user'

const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

const Day: React.FC<{data: IActivity, color: number}> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.setAttribute('data-date', props.data.date.toLocaleDateString('en-SE'))
    ref.current.setAttribute('data-count', props.data.count.toString())
    ref.current.setAttribute('data-active', props.data.active.toString())
    ref.current.style.setProperty('background-color', `#${props.color.toString(16)}`)
    ref.current.style.setProperty('background', `#${props.color.toString(16)}`)
  }, [ref, props])
  return (
    <div ref={ref} className="day w-[10px] h-[10px] rounded-sm
                              mb-[3px] last:m-0 bg-inherit">
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
    <div className='flex flex-col mr-[3px] last:m-0 snap-start justify-start'>
      {activities.map((data, i) => <Day data={data} key={i}
        color={linearInterpolate(colors[0], colors[1], data.active)} />)}
    </div>
  )
}

const WeekNames: React.FC = (props) => {
  return (
    <div className="flex flex-col mr-[5px] text-mtext-dim-1 text-xs mt-[17px]">
      {['mon', '', 'wed', '', 'fri', '', ''].map((v, i) => (
        <div className="h-[10px] rounded-sm mb-[3px] last:m-0" key={i}>
          {v}
        </div>
      ))}
    </div>
  )
}

interface MemoActivityProps {
  activities: IActivity[]
  colors: [number, number]
  startWeekday?: number
}

/**
 * Linear interpolation
 * @param colorA Hex color
 * @param colorB Hex color
 * @param ratio Interpolation ratio
 * @returns Interpolated hex color
 */
function linearInterpolate(colorA: number, colorB: number, ratio: number) {
  const ar = (colorA >> 16) & 0xFF
  const ag = (colorA >> 8)  & 0xFF
  const ab = colorA & 0xFF
  const br = (colorB >> 16) & 0xFF
  const bg = (colorB >> 8)  & 0xFF
  const bb = colorB & 0xFF
  return Math.floor((br - ar) * ratio + ar) << 16 |  // red
         Math.floor((bg - ag) * ratio + ag) << 8  |  // green
         Math.floor((bb - ab) * ratio + ab)          // blue
}

export const MemoActivity: React.FC<MemoActivityProps> = (props) => {
  const { activities, colors } = props
  const startWeekday = props.startWeekday ?? 1  // Default: Monday
  const colorLevels  = useMemo(() => {
    return Array(5).fill(0).map((_, i) => {
      const ratio = i / 4
      return linearInterpolate(colors[0], colors[1], ratio)
    })
  }, [colors])
  const weeks = useMemo(() => {
    let dayCount = 0
    return activities.reduce((acc, day, i, arr) => {
      dayCount++
      if (day.date.getDay() === startWeekday) {  // start of week
        acc.push(arr.slice(i, i + dayCount))
        dayCount = 0
      }
      return acc
    }, [] as IActivity[][])
  }, [activities, startWeekday])

  const hoverRef = useRef<HTMLDivElement>(null)
  const toolRef = useRef<HTMLDivElement>(null)
  const [dataDate, setDataDate]   = useState<string | null>(null)
  const [dataCount, setDataCount] = useState<string | null>(null)

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
    if (!hoverRef.current) return
    const hover = hoverRef.current
    toolRef.current?.style.setProperty('display', 'none')
    hover.addEventListener('mouseover', onMouseOver)
    hover.addEventListener('mouseleave', onMouseLeave)
    // NOTE: Hack to scroll to the latest data first
    hoverRef.current.scrollLeft = hoverRef.current.scrollWidth
    return () => {
      hover.removeEventListener('mouseover', onMouseOver)
      hover.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseOver, onMouseLeave, hoverRef, toolRef])

  return (
    <div className="bg-mbg-1 px-3 pb-2 pt-2 m-auto rounded">
      <div className="flex m-1">
        <WeekNames />
        <div ref={hoverRef} className='w-[350px] overflow-scroll snap-x' >
          <div className='grid grid-flow-col h-[17px] text-xs text-mtext-dim-1'>
            {weeks.reduce((acc, week, i) => {
              const dayIndex = week.findIndex(d => d.date.getDate() === 1)
              if (dayIndex !== -1) {
                const day = week[dayIndex]
                acc.push(day.date.getMonth())
              } else {
                acc.push(-1)
              }
              return acc
            }, [] as number[]).map((month, i) => (
              <span className='w-[10px] mr-[3px] last:m-0' key={i}>
                {month === -1 ? '' : MONTH_NAMES[month]}
              </span>
            ))}
          </div>
          <div className='grid grid-flow-col ml-auto snap-start'>
            {weeks.map((week, i) => (
              <Week activities={week} key={i} colors={colors} />
            ))}
          </div>
        </div>
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
