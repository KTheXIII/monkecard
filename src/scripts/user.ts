import { APP_NAME } from './env'
import {
  TCommand,
  ECommandMode
} from '@models/command'
import { Subject } from 'rxjs'
import { User, UserJSON } from '@models/user'
import { ANIMAL_NAMES } from '@assets/AnimalNames'
import { StudySession } from '@models/study'
import {
  downloadData,
  loadUser,
  openTextFile,
  saveUser
} from '@scripts/cache'
import { Monke } from '@scripts/monke'
import { Command } from '@scripts/command'

export const randomName = () => ANIMAL_NAMES[Math.floor(
  Math.random() * ANIMAL_NAMES.length
)]
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
    created: currentDate,
    updated: currentDate
  }
}

export function toJSON(user: User): UserJSON {
  return {
    name: user.name,
    avatar: user.avatar,
    preference: user.preference,
    metrics: {
      visits: user.metrics.visits
    },
    created: user.created.getTime(),
    updated: user.updated.getTime()
  }
}

export function toUser(userJSON: UserJSON): User {
  return {
    name: userJSON.name,
    avatar: userJSON.avatar,
    preference: userJSON.preference,
    metrics: userJSON.metrics,
    created: new Date(userJSON.created),
    updated: new Date(userJSON.updated)
  }
}

interface UserMonkeData {
  user: User
  session?: StudySession
}

export class UserMonke {
  async init() {
    this.subject.session.subscribe(s => this.session = s)

    this.subject.user.subscribe(u => {
      const userjson = toJSON(u)
      saveUser(userjson)
    })
    this.subject.user.subscribe(u => this.data.user = u)
    await this.load()

    if (this.data.user.metrics.visits.length > 0) {
      const visits = this.data.user.metrics.visits
      const lastVisit = visits[visits.length - 1]
      const lastVisitTime = new Date(lastVisit)
      if (Date.now() - lastVisitTime.getTime() > LOG_VISIT_INTERVAL)
        this.data.user.metrics.visits.push(Date.now())
    } else {
      this.data.user.metrics.visits.push(Date.now())
    }
    this.data.user.updated = new Date()
    this.subject.user.next(this.data.user)
  }

  async load() {
    try {
      const userjson = await loadUser()
      this.subject.user.next(toUser(userjson))
    } catch (err) {
      this.subject.user.next(createUser())
    }
  }

  regiser(command: Command<TCommand>) {
    command.addBase('user', async () => {
      command.next([
        [ 'edit name', async () => {
          return {
            success: false,
            default: this.data.user.name,
            mode: ECommandMode.Input,
            fn: async (input) => {
              if (input === '') return { success: false }
              this.data.user.name = input
              this.subject.user.next(this.data.user)
              return { success: true }
            }
          }
        }],
        ['save', async () => {
          downloadData(`${APP_NAME}-user-data`,
            JSON.stringify(toJSON(this.data.user)))
          return { success: true, hint: 'saved' }
        }],
        ['load', async () => {
          openTextFile('.json').then(v => {
            try {
              const json = JSON.parse(v)
              const user = toUser(json)
              this.subject.user.next(user)
            } catch (e) {
              console.error(e)
            }
          })
          return { success: true }
        }],
        ['stats', async () => {
          const visits = this.data.user.metrics.visits.length
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

  setSession(session: StudySession) {
    this.session = session
  }
  getSession() {
    return this.session
  }
  getUser() {
    return this.data.user
  }

  get subjectUser() {
    return this.subject.user
  }
  get subjectSession() {
    return this.subject.session
  }

  private subject = {
    user: new Subject<User>(),
    session: new Subject<StudySession>()
  }
  private data: UserMonkeData = {
    user: createUser(),
    session: undefined
  }
  private session?: StudySession
}
