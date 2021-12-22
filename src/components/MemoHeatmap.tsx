import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { IActivity } from '@models/user'
import { number } from 'fp-ts'

const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const BOX_SIZE    = 10
const BOX_PADDING = 3
const BOX_R       = 2

interface DayProps {
  data: IActivity
  color: number
  x: number
  y: number
}

const Day: React.FC<DayProps> = (props) => {
  return (
    <rect width={BOX_SIZE} height={BOX_SIZE} x={props.x} y={props.y}
      rx={BOX_R} ry={BOX_R}
      data-date={props.data.date.toLocaleDateString('en-SE')}
      data-count={props.data.count.toString()}
      fill={`#${props.color.toString(16)}`}
    ></rect>
  )
}

interface IWeek {
  activities: IActivity[],
  colors: [number, number],
  x: number
  y: number
}
const Week: React.FC<IWeek> = (props) => {
  const { activities, colors, x, y } = props
  return (
    <g x={x} y={y}>
      {activities.map((data, i) => <Day data={data} key={i}
        x={x} y={i * (BOX_PADDING + BOX_SIZE) + y}
        color={linearInterpolate(colors[0], colors[1], data.active)} />)}
    </g>
  )
}

const WeekNames: React.FC = (props) => {
  return (
    <div className="flex flex-col mr-[5px] text-mtext-dim-1 text-xs mt-[20px]">
      {['mon', '', 'wed', '', 'fri', '', ''].map((v, i) => (
        <div className="h-[10px] rounded-sm mb-[3px] last:m-0" key={i}>
          {v}
        </div>
      ))}
    </div>
  )
}

interface MemoHeatmapProps {
  heats: IActivity[]
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

export const MemoHeatmap: React.FC<MemoHeatmapProps> = (props) => {
  const { heats, colors } = props
  const startWeekday = props.startWeekday ?? 1  // Default: Monday
  const colorLevels  = useMemo(() => {
    return Array(5).fill(0).map((_, i) => {
      const ratio = i / 4
      return linearInterpolate(colors[0], colors[1], ratio)
    })
  }, [colors])
  const weeks = useMemo(() => {
    let dayCount = 0
    return heats.reduce((acc, day, i, arr) => {
      dayCount++
      if (day.date.getDay() === startWeekday) {  // start of week
        acc.push(arr.slice(i, i + dayCount))
        dayCount = 0
      }
      return acc
    }, [] as IActivity[][])
  }, [heats, startWeekday])
  const conRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!conRef.current) return
    if (conRef.current.scrollLeft === 0)
      conRef.current.scrollLeft = conRef.current.scrollWidth
  }, [weeks])

  return (
    <div className="bg-mbg-1 px-3 pb-2 pt-2 m-auto rounded w-full md:w-[480px]">
      <div className="flex m-1">
        <WeekNames />
        <div ref={conRef} className='overflow-auto m-auto'>
          <svg className='text-mtext-dim-1'
            width={`${weeks.length * (BOX_SIZE + BOX_PADDING)}px`}
            height={`${7 * (BOX_SIZE + BOX_PADDING) + 20}px`}>
            {weeks.reduce((acc, week, i) => {
              const dayIndex = week.findIndex(d => d.date.getDate() === 1)
              if (dayIndex !== -1) {
                const day = week[dayIndex]
                acc.push(day.date.getMonth())
              } else {
                acc.push(-1)
              }
              return acc
            }, [] as number[])
              .map((m, i) => [m, i]).filter(([m]) => m !== -1)
              .map(([month, i]) => (
                <text key={i} x={i * (BOX_SIZE + BOX_PADDING) + 1} y={15}
                  fontSize='11px'
                  fill='currentColor'>
                  {month === -1 ? '' : MONTH_NAMES[month]}
                </text>
              ))}
            {weeks.map((week, i) => (
              <Week activities={week} key={i}
                colors={colors} x={i * (BOX_SIZE + BOX_PADDING)} y={20} />
            ))}
          </svg>
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
