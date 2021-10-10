import { CollectionSource } from './source'
import { ICollection } from './collection'

export interface ISourceSet {
  url: string
  data: CollectionSource | null
}

export interface ICollectionSet {
  sources: ISourceSet[]
  collection: ICollection | null
}
