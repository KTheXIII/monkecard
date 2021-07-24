import {
  IUserModel,
  IUserJSON,
  IQuestionStat,
  TKeyStat,
  TKeyDate
} from '@models/user.model'

const USER_LOCAL_KEY = 'current-user'

export function of(username = 'some-user'): IUserModel {
  const date = new Date()
  return {
    _tag: 'User',
    name: username,
    created: date,
    updated: date,
    saved: new Map<string, number>(),
    questions: new Map<string, IQuestionStat>()
  }
}

export async function request(): Promise<IUserModel> {
  const userJSON = localStorage.getItem(USER_LOCAL_KEY)
  if (userJSON !== null) {
    const userParsed = JSON.parse(userJSON) as IUserJSON
    const questionsMap = new Map<string, IQuestionStat>()
    const savedMap = new Map<string, number>()
    for (const { key, value } of userParsed.questions)
      questionsMap.set(key, value)
    for (const { key, value } of userParsed.saved)
      savedMap.set(key, value)

    return Promise.resolve({
      ...userParsed,
      created: new Date(userParsed.created),
      updated: new Date(userParsed.updated),
      _tag: 'User',
      questions: questionsMap,
      saved: savedMap
    })
  }
  return Promise.resolve(of())
}

export async function save(user: IUserModel): Promise<IUserModel> {
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
