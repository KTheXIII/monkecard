import { ItemSource } from '@models/source'

export enum EItemType {
  Unknown  = -1,
  Memo     =  0,
  Question =  1
}

export interface Item {
  type: EItemType
  id: string
  hash: string
  keywords: string[]
  lang?: string
}

export interface Memo extends Item {
  front: string
  back: string
}

export interface OptionBase {
  text: string
  correct: boolean
}

export interface QuestionBase extends Item {
  text: string
  description?: string
  note?: string
}

export interface IOption extends OptionBase {
  marked: boolean
}

export interface IQuestion extends QuestionBase {
  options: IOption[]
}

export interface ICollection {
  title: string
  description: string
  created: Date
  updated: Date

  items: Map<string, ItemSource>
  lang?: string
}
