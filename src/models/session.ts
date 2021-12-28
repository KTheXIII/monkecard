import { Item, EItemType } from '@models/item'

export interface ISession {
  start:      number
  end:        number
  type:       EItemType
  time:       number[]  // Time spent on each item
  collection: string    // Collection title
  confidence: number[]  // Confidence on each item
  completed:  number[]  // Completed items
  items:      Item[]
}

export type TItemJSON = {
  time: number        // Time spent on the item
  confidence: number
  itemHash: string    // Hash of the item
  itemID: string      // Item ID, this might not be unique
}

export interface ISessionJSON {
  start: number
  end:   number
  type: EItemType
  items: TItemJSON[]
}
