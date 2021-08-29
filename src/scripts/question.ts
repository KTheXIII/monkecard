export enum EQuestionType {
  Unknown = -1,
  Multi   =  0,
  Single  =  1,
}

export interface CollectionBase<DATE> {
  title: string
  description?: string

  created: DATE
  updated: DATE
  lang?: string
}

export interface OptionBase {
  text: string
  correct: boolean
}

export interface QuestionBase {
  text: string
  description?: string
  id: string
  keywords: string[]
  lang?: string
}

export interface IOption extends OptionBase {
  marked: boolean
}

export interface Question extends QuestionBase {
  options: IOption[]
  type: EQuestionType
}

export interface Collection extends CollectionBase<Date> {
  source: string
  keywords: string[]
}

export interface IKeywords {
  name: string
  quizIDs: string[]
}
