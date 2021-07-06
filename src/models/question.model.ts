import { IImageModel } from './image.model'

// Model for thet actual use
export interface IQOptionModel {
  text: string
  marked: boolean
  correct: boolean
}

export interface IQuestionModel {
  content: string
  image?: IImageModel
  options: IQOptionModel[]
  source: string

  isMarked: boolean
  isAnswered: boolean
}

export interface IQSessionModel {
  questions: IQuestionModel[]
  start: number
  end: number
}

export interface IProcessedModel {
  questions: IQuestionModel
}
