import { Subject } from 'rxjs'
import { ANIMAL_NAMES } from '@assets/AnimalNames'
import {
  TCommand,
  ECommandMode
} from '@models/command'
import {
  User,
  UserJSON,
  IActivity,
  TimeData,
} from '@models/user'
import { APP_NAME } from '@scripts/env'
import { Command } from '@scripts/command'
import {
  saveUser,
  loadUserRAW,
  downloadText,
  openFile,
  readTextFile,
} from '@scripts/cache'

export const randomName = () => ANIMAL_NAMES[
  Math.floor(Math.random() * ANIMAL_NAMES.length)
]
const LOG_VISIT_INTERVAL = 1000 * 60 * 10

export function createUser(username?: string): User {
  const name = username || randomName()
  const currentDate = new Date()
  return {
    name: name,
    avatar: undefined,
    preference: {
      theme: 'auto-theme'
    },
    metrics: {
      visits: [],
    },
    memo: {
      history: [],
      saved: [],
    },
    created: currentDate,
    updated: currentDate
  }
}

export function userToJSON(user: User): UserJSON {
  return {
    name: user.name,
    avatar: user.avatar,
    preference: user.preference,
    metrics: {
      visits: user.metrics.visits
    },
    memo: {
      history: user.memo.history,
      saved: user.memo.saved
    },
    created: user.created.getTime(),
    updated: user.updated.getTime()
  }
}

export function jsonToUser(userJSON: UserJSON): User {
  const preference = userJSON.preference ?? { theme: 'auto-theme' }
  const metrics = userJSON.metrics ?? {
    visits: []
  }
  const memo = userJSON.memo ?? {
    history: [],
    saved: []
  }
  return {
    name: userJSON.name,
    avatar: userJSON.avatar,
    preference: preference,
    metrics: metrics,
    memo: memo,
    created: new Date(userJSON.created),
    updated: new Date(userJSON.updated)
  }
}

export class MonkeUser {
  constructor() {
    const today = new Date(new Date().toLocaleDateString('en-SE'))
    const day = 24 * 60 * 60 * 1000
    this.activities = Array(365).fill(0).map((_, i) => {
      return {
        active: 0,
        count: 0,
        date: new Date(today.getTime() - i * day),
      } as IActivity
    })
  }

  async init() {
    this.subject.subscribe(u => {
      const userjson = userToJSON(u)
      saveUser(userjson)
    })
    this.subject.subscribe(u => this.user = u)
    await this.load(await loadUserRAW())

    if (this.user.metrics.visits.length > 0) {
      const visits = this.user.metrics.visits
      const lastVisit = visits[visits.length - 1]
      const lastVisitTime = new Date(lastVisit)
      if (Date.now() - lastVisitTime.getTime() > LOG_VISIT_INTERVAL)
        this.user.metrics.visits.push(Date.now())
    } else {
      this.user.metrics.visits.push(Date.now())
    }
    this.user.updated = new Date()
    this.next(this.user)
  }

  async reload() {
    await this.load(await loadUserRAW())
  }

  async load(raw: string) {
    try {
      this.loading.next(true)
      const json = JSON.parse(raw)
      const user = jsonToUser(json)

      const today = new Date(new Date().toLocaleDateString('en-SE'))
      const day = 24 * 60 * 60 * 1000
      const current = user
      const visits = current.metrics.visits
      const dataPoints = visits.reduce((acc, cur) => {
        const date = new Date(cur)
        const justDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        if (acc.length === 0) acc.push({
          time: justDate.getTime(),
          data: 1
        })
        const last = acc[acc.length - 1]
        if (last.time === justDate.getTime())
          last.data += 1
        else
          acc.push({
            time: justDate.getTime(),
            data: 1
          })
        return acc
      }, [] as TimeData<number>[]).reverse()

      const largest = Math.max(...dataPoints.map(d => d.data))
      const len = 365 - dataPoints.length > 0 ? 365 - dataPoints.length : 0

      this.activities = dataPoints.concat(Array(len).fill({ time: 0, data: 0 }))
        .map((d, i) => ({
          time: d.time > 0 ? d.time : today.getTime() - (i * day),
          data: d.data
        } as TimeData<number>))
        .map(d => ({
          active: d.data / largest,
          count: d.data,
          date: new Date(d.time),
        } as IActivity)).reverse()

      this.next(user)
      this.loading.next(false)
    } catch (err) {
      this.next(createUser())
    }
  }

  regiser(command: Command<TCommand>) {
    command.addBase('user', async () => {
      command.next([
        [ 'edit name', async () => {
          return {
            success: false,
            value: this.user.name,
            mode: ECommandMode.Input,
            fn: async (input) => {
              if (input === '') return { success: false }
              this.editName(input)
              return { success: true }
            }
          }
        }],
        ['save', async () => {
          downloadText(`${APP_NAME}-user-data`,
            JSON.stringify(userToJSON(this.user)))
          return { success: true, hint: 'saved' }
        }],
        ['load', async () => {
          return await openFile('.json')
            .then(f => {
              command.next([
                ['yes', async () => {
                  await this.load(await readTextFile(f))
                }],
                ['no', async () => {/* */}]
              ])
              return {
                success: false,
                hint: `load user data from file '${f.name}'?`,
                restore: command.restore.bind(command)
              }
            })
            .catch(err => {
              return { success: false, hint: err.message }
            })
        }],
        ['delete', async () => {
          command.next([
            ['yes', async () => {
              this.subject.next(createUser())
            }],
            ['no', async () => {
              return { success: true }
            }]
          ])
          return {
            success: false,
            hint: 'delete user?',
            restore: command.restore.bind(command),
          }
        }],
        ['stats', async () => {
          const visits = this.user.metrics.visits.length
          command.next([
            [`visits: ${visits}`, async () => {/**/}],
          ])
          return { success: false }
        }]
      ])

      return {
        success: false,
        hint: 'select (up/down)',
        restore: command.restore.bind(command)
      }
    })
  }

  getActivities() { return this.activities }
  subIsLoading(fn: (loading: boolean) => void) {
    this.loading.subscribe(fn)
  }
  current() { return this.user ?? createUser() }
  next(user: User) {
    this.user = user
    this.subject.next(user)
  }
  sub(fn: (user: User) => void) {
    return this.subject.subscribe(fn)
  }
  save() {
    this.subject.next(this.user)
  }
  editName(name: string) {
    this.user.name = name
    this.subject.next(this.user)
  }

  private loading = new Subject<boolean>()
  private subject = new Subject<User>()
  private user!: User
  private activities: IActivity[]
}
