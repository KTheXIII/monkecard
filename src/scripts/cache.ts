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

export function downloadData(filename: string, json: string) {
  const e = document.createElement('a')
  e.setAttribute('href',
    'data:text/json;charset=utf-8,' + encodeURIComponent(json))
  e.setAttribute('download', filename + '.json')
  e.style.display = 'none'
  document.body.appendChild(e)
  e.click()
  document.body.removeChild(e)
}

export function openTextFile(accept?: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const file = document.createElement('input')
    file.type = 'file'
    file.accept = accept ?? '.txt,.json,.yml,.yaml'
    file.value = ''
    file.focus()
    file.multiple = false
    file.style.display = 'none'
    document.body.appendChild(file)
    file.click()
    file.onchange = () => {
      if (!file.files) return
      const reader = new FileReader()
      reader.onload = e => {
        if (e.target && e.target.result) {
          const text = e.target.result.toString()
          resolve(text)
        } else {
          reject('Error reading file')
        }
      }
      reader.readAsText(file.files[0])
    }
    file.onerror = (e) => {
      reject(e)
    }
    document.body.removeChild(file)
  })
}
