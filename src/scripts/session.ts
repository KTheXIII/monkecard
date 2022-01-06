import { User } from './../models/user'
import { ICollection } from './../models/collection'
import { Subject } from 'rxjs'
import { ISession } from '@models/session'
import { Item, EItemType } from '@models/item'

export class MonkeSession {
  create(collection: ICollection, type: EItemType, itemIDs: string[]): ISession {
    const time: number[] = []
    const confidence: number[] = []
    const completed: number[] = []
    const items: Item[] = []
    for (const itemID of itemIDs) {
      const item = collection.items.get(itemID)
      if (item) {
        time.push(0)
        confidence.push(0)
        completed.push(0)
        items.push({ ...item })
      }
    }
    const session: ISession = {
      start: Date.now(),
      end: 0,
      type: type,
      collection: collection.title,
      time: time,
      confidence: confidence,
      completed: completed,
      items: items,
    }
    return this.next(session)
  }

  complete(session: ISession): ISession {
    session.end = Date.now()
    return session
  }

  current() {
    return this.session
  }

  next(session: ISession): ISession {
    this.session = session
    this.subject.next(session)
    return session
  }

  sub(fn: (session: ISession) => void) {
    return this.subject.subscribe(fn)
  }

  setUser(user: User) {
    this.user = user
  }

  private user!: User
  private session?: ISession
  private subject = new Subject<ISession>()
}
