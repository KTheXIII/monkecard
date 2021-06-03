export interface IQuestionModel {
  content: string
  image: IImageModel
  options: string[]
  correct: number[]
  categories: string[]
  source: string
}

export interface IImageModel {
  source: string
}
