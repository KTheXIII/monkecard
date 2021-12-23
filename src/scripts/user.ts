import { Subject } from 'rxjs'
import { User, UserJSON } from '@models/user'
import { ANIMAL_NAMES } from '@assets/AnimalNames'
import { StudySession } from '@models/study'
import { loadUser, saveUser } from '@scripts/cache'

export const randomName = () => ANIMAL_NAMES[Math.floor(
  Math.random() * ANIMAL_NAMES.length
)]

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

    this.data.user.metrics.visits.push(Date.now())
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

  async save() {
    this.subject.user.next(this.data.user)
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
