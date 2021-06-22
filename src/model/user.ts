import {} from './question'

export interface ISessionModel {
    id: string
    start: Date
    stop: Date
    questionCount: number
}

// export interface IUserQuestionModel {
//     id: string
//     count: number
// }

// export interface IQuestionHistoryModel {
//     questionIDs: string[]
// }

export interface IUser {
    sessions: ISessionModel[]
}

