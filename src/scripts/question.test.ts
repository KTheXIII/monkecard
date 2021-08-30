import { expect } from 'chai'

import { Question, EQuestionType } from './question'

describe('Question', () => {

  it('should create question', () => {
    const question: Question = {
      id: '1',
      text: 'Question text',
      description: 'Question Description',
      type: EQuestionType.Single,
      options: [],
      keywords: []
    }

    expect(question.id).to.equal('1')
    expect(question.text).to.equal('Question text')
    expect(question.description).to.equal('Question Description')
    expect(question.type).to.equal(EQuestionType.Single)
    expect(question.options).to.deep.equal([])
    expect(question.keywords).to.deep.equal([])
  })

})
