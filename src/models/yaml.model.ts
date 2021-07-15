export interface IYAMLFiles {
  verison: string
  files: string[]
}

export interface IYAMLSubject {
  version: string
  info: { title: string, root?: string }
  categories: { name?: string, id: string }[]
  files: string[]
}

export interface IYAMLQuestions {
  verison: string
  datas: IYAMLRawQuestion[]
}

export interface IYAMLRawQuestion {
  content: string
  image: { source: string, alt?: string } | undefined
  options: string[]
  correct: number[]
  categories: string[]
  source: string
}
