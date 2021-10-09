import { CollectionSource } from './source'
import { ICollection } from './collection'

export interface ISourceSet {
  source: string
  data: CollectionSource | null
}

export interface ICollectionSet {
  sources: ISourceSet[]
  collection: ICollection | null
}
