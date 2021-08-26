import { ISession, IQuestion } from '@models/question.model'

export function create(questions: IQuestion[]): ISession {
  return {
    start: Date.now(),
    end: 0,
    questions: questions
  }
}
