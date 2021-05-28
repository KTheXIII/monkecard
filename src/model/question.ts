export interface IQuestionModel {
  question:      string       // Question
  image:         IImageModel
  options:       string[]
  correct:       number[]
  categories:    string[]
  subcategories: string[]
  infoList:      IInfoModel[] // Regex and link
  smallNotes:    string       // Markdown note
  source:        string       // CCCCC-TYYMMDDQNN
}

export interface IInfoModel {
  regex: string
  link: string
}

export interface IImageModel {
  source?: string
}
