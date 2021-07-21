import { assert, expect } from 'chai'

import { IYAMLRawQuestion } from '@models/yaml.model'
import * as Download from '@scripts/download'
import * as Request from '@scripts/request'

describe('Test question files', () => {
  it('Fetch root file', async () => {
    const files = await Download.files()
    assert(files.length > 0, 'File is empty')
  })

  it('Fetch subject', async () => {
    const subject = await Download.subjects(await Download.files())
    assert(subject.length > 0, 'Subject is empty')
  })

  it('Fetch questions', async () => {
    const subjects = await Download.subjects(await Download.files())
    const questionList: IYAMLRawQuestion[] = []
    const questionMap = new Map<string, IYAMLRawQuestion>()
    let duplicate: IYAMLRawQuestion | undefined

    for (const subject of subjects) {
      for (const file of subject.files) {
        const questionFile = await Request.questions(file)
        questionList.push(...questionFile.datas)
      }
    }

    for (const question of questionList) {
      const exist = questionMap.has(question.source)
      if (exist) {
        duplicate = question
        break
      } else {
        questionMap.set(question.source, question)
      }
    }

    expect(duplicate,
      `There is a duplication with ID: ${duplicate?.source}`
    ).undefined
  })
})
