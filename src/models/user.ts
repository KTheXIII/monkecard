export interface IActivity {
  date: Date
  count: number
  active: number
}

export interface TimeData<T> {
  time: number
  data: T
}

export interface IUserMetric {
  visits: number[]
  // idle: TimeData<number>[]
  // active: TimeData<number>[]
}

// export interface MemoMetric {
// }

export interface IUserPreference {
  theme: string
}

export interface IUser<DATE> {
  name: string
  avatar?: string
  preference: IUserPreference
  metrics: IUserMetric

  created: DATE
  updated: DATE
}

export type UserJSON = IUser<number>
export type User     = IUser<Date>
