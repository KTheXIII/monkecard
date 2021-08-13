import { assert, expect } from 'chai'
import * as io from 'io-ts'
import { PathReporter } from 'io-ts/PathReporter'
import { isRight, fold } from 'fp-ts/These'
import { pipe } from 'fp-ts/function'

import { IYAMLRawQuestion } from '@models/yaml.model'
import * as Download from '@scripts/download'
import * as Request from '@scripts/request'

// Root file data structure
// Use with io-ts for type-checking
const RootFile = io.type({
  version: io.string,
  files: io.array(io.string)
})

// Subject File data structure
// Use with io-ts for type-checking
const SubjectFile = io.type({
  version: io.string,
  info: io.type({
    title: io.string,
    root: io.string
  }),
  categories: io.array(io.type({
    name: io.string,
    id: io.string
  })),
  files: io.array(io.string)
})

// Question File data structure
// Use with io-ts for type-checking
// !!! NOTE !!!
// image object is not check for type-safety
// since I don't know how to do it with io-ts.
// The image object is optional and the alt attribute is not required.
const QuestionFile = io.type({
  version: io.string,
  datas: io.array(io.type({
    content: io.string,
    image: io.unknown,
    options: io.array(io.string),
    correct: io.array(io.number),
    categories: io.array(io.string),
    source: io.string
  }))
})

const QuestionFileOverview = io.type({
  version: io.string,
  datas: io.UnknownArray
})

const QuestionData = io.type({
  content: io.string,
  image: io.unknown,
  options: io.array(io.string),
  correct: io.array(io.number),
  categories: io.array(io.string),
  source: io.string
})

describe('Test question files', () => {
  it('Fetch root file', async () => {
    const files = await Download.files()
    assert(files.length > 0, 'File is empty')
  })

  it('Fetch subject', async () => {
    const subject = await Download.subjects(await Download.files())
    assert(subject.length > 0, 'Subject is empt y')
  })

  it('Validate files contents', async () => {
    const files = await Request.files()
    const decodeValue = RootFile.decode(files)

    expect(
      isRight(decodeValue),
      `Root file is not in correct format:
      ${PathReporter.report(decodeValue)}`
    ).true
  })

  it('Validate subject file contents', async () => {
    const files = await Download.files()
    for (const file of files) {
      const subject = await Request.subject(file)
      const decodeValue = SubjectFile.decode(subject)

      expect(
        isRight(decodeValue),
        `Subject file "${file}" is not in correct format:
        ${PathReporter.report(decodeValue)}`
      ).true
    }
  })

  it('Validate question format', async () => {
    const files = await Download.files()
    for (const file of files) {
      const subject = await Request.subject(file)
      for (const question of subject.files) {
        const path = subject.info.root + question
        const questionFile = await Request.questions(path)
        const questionValue = QuestionFileOverview.decode(questionFile)
        // const decodeValue = QuestionFile.decode(questionFile)

        const datas = pipe(QuestionFileOverview.decode(questionFile), fold(
          errs => {
            expect(true,
              `Question File ${question} is not in correct format`
            ).false
            return []
          },
          a => a.datas,
          b => []
        ))

        expect(datas).to.not.be.empty

        datas.forEach((data, index) => {
          const question = QuestionData.decode(data)
          expect(
            isRight(question),
            `Question ${index + 1} is not in correct format:
            ${PathReporter.report(question)}`
          ).true
        })
      }
    }
  })

  it('Check for duplicate question IDs', async () => {
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
