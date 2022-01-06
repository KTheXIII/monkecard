import * as io from 'io-ts'
import { Item } from '@models/item'

// Collection status
export enum ECStatus {
  Loading   = 0,
  Loaded    = 1,
  NotLoaded = 2,
  Error     = 3,
}

// Collection type
export enum ECType {
  Unknown = -1,
  Local   =  0,
  Remote  =  1,
  Saved   =  2,
}

export interface ICollectionBase {
  type: ECType
  source: string    // source url or hash of local collection
  status: ECStatus
  error?: string    // error message
}

export interface ICollection extends ICollectionBase {
  title: string
  description?: string
  created: Date
  updated: Date

  items: Map<string, Item>
  lang?: string
}

const IODate = new io.Type<Date, Date, unknown>(
  'Date',
  (input: unknown): input is Date => typeof input === 'object' && input instanceof Date,
  (input, context) => (typeof input === 'object' && input instanceof Date ? io.success(input) : io.failure(input, context)),
  io.identity
)

export const CollectionSource = io.type({
  title: io.string,
  description: io.union([io.string, io.undefined]),
  lang: io.union([io.string, io.undefined]),
  created: io.union([io.string, io.number, IODate]),
  updated: io.union([io.string, io.number, IODate]),
  items: io.array(io.unknown)
})

export type TCollectionSource = io.TypeOf<typeof CollectionSource>
