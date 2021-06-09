// Model description for fetched data
export interface IQuestionModel {
  content: string
  image?: IImageModel
  options: string[]
  correct: number[]
  categories: string[]
  source: string
}

export interface IImageModel {
  source: string
}

// Model for thet actual use
export interface IQOptionModel {
  text: string
  marked: boolean
  correct: boolean
}

export interface IQuizModel {
  content: string
  image?: IImageModel
  options: IQOptionModel[]
  source: string

  isMarked: boolean
}
