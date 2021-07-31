import { IUserSettings } from './settings.model'

type TMapQuestions = Map<string, IQuestionStat>
type TMapSaved = Map<string, number>
export type TKeyDate = { key: string, value: number }
export type TKeyStat = { key: string, value: IQuestionStat }

export interface IQuestionStat {
  history: IHistoryModel[]
}

export interface IHistoryModel {
  confidence: number
  correct: boolean
  unix: number
}

interface IUserBase<DATE, SAVED, QUESTIONS> {
  _tag: 'User'
  name: string
  created: DATE
  updated: DATE
  saved: SAVED
  questions: QUESTIONS
  settings: IUserSettings
}

export type IUserJSON = IUserBase<number, TKeyDate[], TKeyStat[]>
export type IUser = IUserBase<Date, TMapSaved, TMapQuestions>
export type TUserList = { key: string, value: IUserJSON }[]
