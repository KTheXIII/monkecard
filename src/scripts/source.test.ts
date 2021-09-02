import { expect } from 'chai'

import * as Source from './source'

describe('Test Source Parser', () => {

  it('should return source urls', () => {
    const returnSources = ['url1', 'url2']
    const query = '?source=url1+url2'
    const sources = Source.extractSource(query)
    expect(sources).to.deep.equal(returnSources)
  })

  it('should return collection urls', () => {
    const returnSources = ['url1', 'url2']
    const query = '?collection=url1+url2'
    const sources = Source.extractCollections(query)
    expect(sources).to.deep.equal(returnSources)
  })

})
