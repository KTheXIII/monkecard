import * as io from 'io-ts'
import { Card } from '@models/Card'

// Collection status
export enum EDeckStatus {
  Loading   = 0,
  Loaded    = 1,
  NotLoaded = 2,
  Error     = 3,
}

// Collection type
export enum EDeckType {
  Unknown = -1,
  Local   =  0,
  Remote  =  1,
  Saved   =  2,
}

// hash format
// collection:sha256<hash>

export interface IDeckBase {
  type: EDeckType
  source: string    // source url or hash of local collection
  status: EDeckStatus
  error?: string    // error message
}

export interface IDeck extends IDeckBase {
  title: string
  description?: string
  created: Date
  updated: Date

  cards: Set<string>
  lang?: string
}

const IODate = new io.Type<Date, Date, unknown>(
  'Date',
  (input: unknown): input is Date => typeof input === 'object' && input instanceof Date,
  (input: unknown, context: io.Context) => (typeof input === 'object' && input instanceof Date ? io.success(input) : io.failure(input, context)),
  io.identity
)

export const DeckSource = io.type({
  title: io.string,
  description: io.union([io.string, io.undefined]),
  lang: io.union([io.string, io.undefined]),
  created: io.union([io.string, io.number, IODate, io.undefined]),
  updated: io.union([io.string, io.number, IODate, io.undefined]),
  cards: io.array(io.unknown)
})

export type TDeckSource = io.TypeOf<typeof DeckSource>
