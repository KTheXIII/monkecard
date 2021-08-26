export type TQuestionMap = Map<string, IQuestion>

export interface ICategory {
  id: string
  name?: string
  questions: string[]
}

export interface ISubject {
  title: string
  categories: ICategory[]
  showCategory: boolean
  selected: Set<ICategory>
  files: string[]
}

export interface IQuestionOption {
  text: string
  marked: boolean
  correct: boolean
}

export interface IImage {
  source: string
  alt?: string
}

export interface IQuestion {
  content: string
  image?: IImage
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
