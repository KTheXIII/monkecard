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

export async function loadUserRAW(): Promise<string> {
  const user = localStorage.getItem(USER_KEY)
  if (user) return user
  return Promise.reject('No user saved')
}

export async function loadUser(): Promise<UserJSON> {
  const user = localStorage.getItem(USER_KEY)
  if (user) return JSON.parse(user)
  return Promise.reject('No user saved')
}

export function downloadText(filename: string, json: string) {
  const e = document.createElement('a')
  e.setAttribute('href',
    'data:text/json;charset=utf-8,' + encodeURIComponent(json))
  e.setAttribute('download', filename + '.json')
  e.style.display = 'none'
  document.body.appendChild(e)
  e.click()
  document.body.removeChild(e)
}

export async function openFile(accept: string): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const file = document.createElement('input')
    file.type = 'file'
    file.accept = accept
    file.value = ''
    file.focus()
    file.multiple = false
    file.style.display = 'none'
    file.onchange = () => {
      if (!file.files)
        reject('No files selected')
      else if (file.files.length === 0)
        reject('No files selected')
      else
        resolve(file.files[0])
    }
    document.body.appendChild(file)
    file.click()
    document.body.removeChild(file)
  })
}

export async function openFiles(accept: string): Promise<FileList> {
  return new Promise<FileList>((resolve, reject) => {
    const file = document.createElement('input')
    file.type   = 'file'
    file.accept = accept
    file.value  = ''
    file.focus()
    file.multiple = true
    file.style.display = 'none'
    file.onchange = () => {
      if (!file.files)
        reject('No files selected')
      else if (file.files.length === 0)
        reject('No files selected')
      else
        resolve(file.files)
    }
    document.body.appendChild(file)
    file.click()
    document.body.removeChild(file)
  })
}

export async function readTextFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) resolve(reader.result.toString())
      else reject(`Error reading file`)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
