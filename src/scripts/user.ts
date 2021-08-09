import {
  IUser,
  IUserJSON,
  IQuestionStat,
  TKeyStat,
  TKeyDate
} from '@models/user.model'

const USER_LOCAL_KEY = 'current-user'

export function loadJSON(json: string): IUserJSON {
  const unix = Date.now()
  const user: IUserJSON = {
    _tag: 'User',
    name: 'username',
    created: unix,
    updated: unix,
    saved: [],
    questions: [],
    settings: {
      theme: 'auto-theme',
      maxQuestions: 5,
      showConfidence: true
    }
  }
  const { settings } = user

  try {
    const data = JSON.parse(json)

    user.name      = data.name      || user.name
    user.created   = data.created   || user.created
    user.updated   = data.updated   || user.updated
    user.saved     = data.saved     || user.saved
    user.questions = data.questions || user.questions

    // Settings
    settings.theme          = data.settings.theme
                              || user.settings.theme
    settings.maxQuestions   = data.settings.maxQuestions
                              || user.settings.maxQuestions
    settings.showConfidence = data.settings.showConfidence
                              || user.settings.showConfidence
  } catch (e) {
    console.error(e)
  }

  return user
}

export function loadUser(userJSON: IUserJSON): IUser {
  const stats = new Map<string, IQuestionStat>()
  const saved = new Map<string, number>()

  for (const { key, value } of userJSON.questions)
    stats.set(key, value)
  for (const { key, value } of userJSON.saved)
    saved.set(key, value)

  return {
    _tag: 'User',
    name: userJSON.name,
    created: new Date(userJSON.created),
    updated: new Date(userJSON.updated),
    saved: saved,
    questions: stats,
    settings: {
      theme: userJSON.settings.theme,
      maxQuestions: userJSON.settings.maxQuestions,
      showConfidence: userJSON.settings.showConfidence
    }
  }
}

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
      maxQuestions: 5,
      showConfidence: false
    }
  }
}

export async function request(): Promise<IUser> {
  const userJSON = localStorage.getItem(USER_LOCAL_KEY)
  const user = userJSON !== null ? loadUser(loadJSON(userJSON)) : of()
  return Promise.resolve(user)
}

export function toJSON(user: IUser): IUserJSON {
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
  return saving
}

export async function save(user: IUser): Promise<IUser> {
  const userJSON = toJSON(user)
  localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(userJSON))
  return request()
}
