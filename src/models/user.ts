export interface TimeData<T> {
  time: number
  data: T
}

export interface IUserMetric {
  visit: number[]
  idle: TimeData<number>[]
  active: TimeData<number>[]
}

export interface MemoMetric {
  infos: string
  saved: TimeData<string>[]  // store the hash of the item
}

export interface IUserSettings {
  theme: string
}

export interface IUser<DATE> {
  id: string
  name: string
  avatar?: string

  settings: IUserSettings
  metrics: IUserMetric
  memo: MemoMetric

  created: DATE
  updated: DATE
}

export type UserJSON = IUser<number>
export type User     = IUser<Date>
