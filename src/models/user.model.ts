type TKeyDate = { key: string, unix: number }

export interface IUserModel {
  name: string
  created: Date
  updated: Date
  sessionCount: number

  saved: TKeyDate[]

  questions: Map<string, IQuestionStat>
}

// export interface IUserJSON {

// }

// function UserToJSON(user: IUserModel) {

// }

// Map.prototype.toJSON = function () {
//   return JSON.stringify({
//     keys: Array.from(this.keys()),
//     values: Array.from(this.values())
//   })
// }

export interface IQuestionStat {
  history: IHistoryModel[]
}

export interface IHistoryModel {
  correct: boolean
  date: number     // UNIX Time
}
