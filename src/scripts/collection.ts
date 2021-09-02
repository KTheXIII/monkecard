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
}

export interface Collection {
  title: string
  description: string
  source: string
  keywords: string[]
  created: Date
  updated: Date

  questions: Map<string, Question>
  lang?: string
}

export interface IKeywords {
  name: string
  quizIDs: string[]
}
