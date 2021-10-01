// import { Collection } from './question'

const SOURCE_LIST_KEY  = 'sources'
const OFFLINE_LIST_KEY = 'offline'

export async function localSourceList(): Promise<string[]> {
  const list = localStorage.getItem(SOURCE_LIST_KEY)
  if (list) return JSON.parse(list)
  else return []
}

export async function localSourceListSave(list: string[]): Promise<void> {
  // TODO: Error handling
  localStorage.setItem(SOURCE_LIST_KEY, JSON.stringify(list))
  return Promise.resolve()
}

export async function ClearStorage(): Promise<void> {
  localStorage.clear()
  return Promise.resolve()
}

// TODO: Offline list
