// import { Collection } from './question'

const SOURCE_LIST_KEY  = 'sources'
const OFFLINE_LIST_KEY = 'offline'

export async function GetSourceList(): Promise<string[]> {
  const list = localStorage.getItem(SOURCE_LIST_KEY)
  if (list) return JSON.parse(list)
  else return []
}

export async function SaveSourceList(list: string[]): Promise<void> {
  // TODO: Error handling
  localStorage.setItem(SOURCE_LIST_KEY, JSON.stringify(list))
  return Promise.resolve()
}

// TODO: Offline list
