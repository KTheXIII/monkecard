import { Item, EItemType } from '@models/collection'

export interface StudySession {
  start: number
  end:   number
  type:  EItemType
  items: Item[]
}

export function emptySession(): StudySession {
  return {
    start: 0,
    end:   0,
    type:  EItemType.Unknown,
    items: [],
  }
}

export function createSession(type: EItemType,
  items: Item[]): StudySession {
  return {
    start: Date.now(),
    end:   0,
    type,
    items,
  }
}
