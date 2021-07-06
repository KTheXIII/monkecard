import { IImageModel } from './image.model'

export interface IRawQuestionModel {
  content: string
  image: IImageModel
  options: string[]
  correct: number[]
  catgeories: string[]
  source: string
}
