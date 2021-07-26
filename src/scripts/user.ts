import {
  IUser,
  IUserJSON,
  IQuestionStat,
  TKeyStat,
  TKeyDate
} from '@models/user.model'

const USER_LOCAL_KEY = 'current-user'

export function of(username = 'some-user'): IUser {
  const date = new Date()
  return {
    _tag: 'User',
    name: username,
    created: date,
    updated: date,
    saved: new Map<string, number>(),
    questions: new Map<string, IQuestionStat>(),
    settings: {
      theme: 'auto-theme',
      maxQuestions: 5
    }
  }
}

export async function request(): Promise<IUser> {
  const userJSON = localStorage.getItem(USER_LOCAL_KEY)
  const user = of()

  if (userJSON !== null) {
    const userParsed = JSON.parse(userJSON) as IUserJSON
    const questionsMap = new Map<string, IQuestionStat>()
    const savedMap = new Map<string, number>()
    for (const { key, value } of userParsed.questions)
      questionsMap.set(key, value)
    for (const { key, value } of userParsed.saved)
      savedMap.set(key, value)

    userParsed.settings = { ...user.settings, ...userParsed.settings }

    return Promise.resolve({
      name: userParsed.name,
      created: new Date(userParsed.created),
      updated: new Date(userParsed.updated),
      _tag: 'User',
      questions: questionsMap,
      saved: savedMap,
      settings: {
        theme: userParsed.settings.theme,
        maxQuestions: userParsed.settings.maxQuestions
      }
    })
  }
  return Promise.resolve(user)
}

export async function save(user: IUser): Promise<IUser> {
  const { questions, saved } = user
  const keyStats: TKeyStat[] = []
  const keySaved: TKeyDate[] = []
  for (const [key, value] of questions)
    keyStats.push({ key, value })
  for (const [key, value] of saved)
    keySaved.push({ key, value })

  user.updated = new Date()

  const saving: IUserJSON = {
    ...user,
    created: user.created.getTime(),
    updated: user.updated.getTime(),
    questions: keyStats,
    saved: keySaved
  }

  localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(saving))
  return request()
}
