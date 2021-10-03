import { expect } from 'chai'

import * as Source from './source'

describe('Test Source Parser', () => {

  it('should return source urls', () => {
    const returnSources = ['url1', 'url2']
    const query = '?source=url1+url2'
    const sources = Source.extractQuerySource(query)
    expect(sources).to.deep.equal(returnSources)
  })

})
