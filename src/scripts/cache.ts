import { UserJSON } from '@models/user'

const SOURCE_LIST_KEY  = 'sources'
const OFFLINE_LIST_KEY = 'offline'
const USER_KEY         = 'user'

export async function getLocalSourceList(): Promise<string[]> {
  const list = localStorage.getItem(SOURCE_LIST_KEY)
  if (list) return JSON.parse(list)
  else return []
}

export async function saveLocalSourceList(list: string[]): Promise<void> {
  // TODO: Error handling
  localStorage.setItem(SOURCE_LIST_KEY, JSON.stringify(list))
  return Promise.resolve()
}

export async function clearCache(): Promise<void> {
  localStorage.clear()
  return Promise.resolve()
}

// TODO: Offline list

export async function saveUser(user: UserJSON): Promise<void> {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return Promise.resolve()
}

export async function loadUser(): Promise<UserJSON> {
  const user = localStorage.getItem(USER_KEY)
  if (user) return JSON.parse(user)
  return Promise.reject('No user saved')
}
