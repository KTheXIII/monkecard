interface IUserBase<DATE> {
  name: string

  created: DATE
  updated: DATE
}

export type UserJSON = IUserBase<number>
export type User     = IUserBase<Date>

const DEFAULT_NAMES = [
  'penguin',
  'dog',
  'cat',
  'whale',
  'fox',
  'turtle',
  'kangaroo',
  'parrot',
  'echidna',
  'giraffe'
]
const randomName = () =>
  DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)]

export function createUser(username?: string): User {
  const name = username || randomName()
  const currentDate = new Date()
  return {
    name: name,
    created: currentDate,
    updated: currentDate
  }
}

export function toJSON(user: User): UserJSON {
  return {
    name: user.name,
    created: user.created.getTime(),
    updated: user.updated.getTime()
  }
}

export function toUser(userJSON: UserJSON): User {
  return {
    name: userJSON.name,
    created: new Date(userJSON.created),
    updated: new Date(userJSON.updated)
  }
}
