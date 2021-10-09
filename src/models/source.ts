import { EItemType } from './collection'

export type TItemType = keyof typeof EItemType
export interface ItemSource {
  type: TItemType
  id: string
  keywords: string[]
  lang?: string
}

export interface OptionSource {
  text: string
  correct?: boolean
}
export interface QuestionSource extends ItemSource {
  text: string
  description?: string
  options: OptionSource[]
}

export interface MemoSource extends ItemSource {
  front: string
  back: string
}

export interface CollectionSource {
  title?: string
  description?: string
  lang?: string
  created: string | number  // ISO 8601 or unix time ms
  updated: string | number  // ISO 8601 or unix time ms

  items?: ItemSource[]
}
