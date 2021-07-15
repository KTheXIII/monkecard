export type TQuestions = Map<string, IQuestion>

export interface ICategory {
  id: string
  name?: string
  questions: string[]
}

export interface ISubject {
  title: string
  categories: ICategory[]
  files: string[]
}

export interface IPageIndex {
  absolute: number
  page: number
  index: number
}

export interface IQuestionOption {
  text: string
  marked: boolean
  correct: boolean
}

export interface IQuestion {
  content: string
  image?: { source: string, alt?: string }
  options: IQuestionOption[]
  source: string
  isMarked: boolean
  isAnswered: boolean
}

export interface ISession {
  questions: IQuestion[]
  start: number  // Unix time in milliseconds
  end:   number  // Unix time in milliseconds
}
