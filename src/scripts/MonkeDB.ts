import { Subject } from 'rxjs'

export class MonkeDB {
  async loginDefault(): Promise<string> {
    const key = `user:default`
    const id = localStorage.getItem(key)
    if (id) {
      this.db.set(key, id)
      return Promise.resolve(id)
    } else return Promise.reject(`No user`)
  }

  async setDefaultLogin(id: string): Promise<void> {
    const key = `user:default`
    try {
      localStorage.setItem(key, id)
      return Promise.resolve()
    } catch (err) {
      this.db.set(key, id)
      return Promise.reject(err)
    }
  }

  async loadUser(id: string): Promise<string> {
    this.loading.next(true)
    const key  = `user:${id}`
    const data = localStorage.getItem(key)
    this.loading.next(false)
    if (data) this.db.set(key, data)
    if (data) return Promise.resolve(data)
    else return Promise.reject(`No user with id:${id}`)
  }
  async loadUserMemory(id: string): Promise<string> {
    const key  = `user:${id}`
    const data = this.db.get(key)
    if (data) return Promise.resolve(JSON.parse(data))
    else return Promise.reject(`No user with id:${id}`)
  }

  async updateUser(id: string, user: string): Promise<void> {
    const key  = `user:${id}`
    this.loading.next(true)
    try {
      localStorage.setItem(key, user)
    } catch (err) {
      this.db.set(key, user)
      return Promise.reject(err)
    }
    this.loading.next(false)
    return Promise.resolve()
  }

  async loadURLs(): Promise<string[]> {
    const key = `sources`
    const data = localStorage.getItem(key)
    if (data) this.db.set(key, data)
    if (data) return Promise.resolve(JSON.parse(data))
    else return Promise.resolve([])
  }
  async loadSourcesMemory(): Promise<string[]> {
    const key  = `sources`
    const data = this.db.get(key)
    if (data) return Promise.resolve(JSON.parse(data))
    else return Promise.resolve([])
  }

  async updateSources(urls: string[]): Promise<void> {
    const key = `sources`
    const json = JSON.stringify(urls)
    try {
      localStorage.setItem(key, json)
      return Promise.resolve()
    } catch (err) {
      this.db.set(key, json)
      return Promise.reject(err)
    }
  }

  readonly loading = new Subject<boolean>()
  private readonly db = new Map<string, string>()
}
