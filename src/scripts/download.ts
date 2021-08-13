import {
  ISubject,
  ICategory,
  IQuestion,
  TQuestionMap,
  IQuestionOption
} from '@models/question.model'
import * as Request from './request'

export async function files(): Promise<string[]> {
  const files = await Request.files()
  return files.files
}

export async function subjects(files: string[]): Promise<ISubject[]> {
  const list: ISubject[] = []

  for (const file of files) {
    try {
      const subject = await Request.subject(file)
      const title = subject.info.title
      const categories: ICategory[] = subject.categories.map(c => {
        return {
          id: c.id,
          name: c.name,
          questions: []
        }
      })
      const files: string[] =  subject.files.map(f => subject.info.root + f)

      list.push({
        title,
        categories,
        files
      })
    } catch (err) {
      console.error(err)
    }
  }

  return list
}

/**
 * Fetch all the questions from a subject
 *
 * @param subjects Subject list
 * @requires subject.Files
 * @mutates subject.categories
 * @returns Question map
 */
export async function questions(subjects: ISubject[]): Promise<TQuestionMap> {
  const map: TQuestionMap = new Map<string, IQuestion>()
  for (const subject of subjects) {
    try {
      for (const file of subject.files) {
        const questionList = await Request.questions(file)
        for (const data of questionList.datas) {
          const source = data.source
          const content = data.content
          const image = data.image
          const options: IQuestionOption[] = data.options.map((text, index) => {
            return {
              text,
              marked: false,
              correct: data.correct.includes(index)
            }
          })

          map.set(source, {
            content,
            image,
            options,
            source,
            isMarked: false,
            isAnswered: false,
          })

          // Mutate the subject's categories
          for (const category of data.categories) {
            const index = subject.categories.findIndex(c => c.id === category)
            if (index !== -1)
              subject.categories[index].questions.push(source)
            else
              subject.categories.push({
                id: category,
                questions: [source],
              })
          }

          // Sort alphabeticly
          subject.categories.sort((a, b) => a.id > b.id ? 1 : -1)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
  return map
}
