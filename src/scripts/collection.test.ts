import { expect } from 'chai'

import {
  IQuestion,
  EItemType,
  Item
} from './collection'

describe('Question', () => {

  it('should create question', () => {
    const item: Item = {
      id: '1',
      text: 'Question text',
      description: 'Question Description',
      options: [],
      keywords: [],
      type: EItemType.Memo
    } as IQuestion

    expect(item.type,
      `Item type is ${item.type === EItemType.Question ? '' : 'not'} a Question`)
      .to.equal(EItemType.Question)
    if (item.type === EItemType.Question) {
      const question: IQuestion = item as IQuestion
      expect(question.id).to.equal('1')
      expect(question.text).to.equal('Question text')
      expect(question.description).to.equal('Question Description')
      expect(question.options).to.deep.equal([])
      expect(question.keywords).to.deep.equal([])
    }
  })

})
