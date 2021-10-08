import { expect } from 'chai'

import * as Source from './source'

describe('Test Source Parser', () => {

  it('should return source urls from query parameter source=', () => {
    const returnSources = ['url1', 'url2']
    const query = '?source=url1+url2'
    const sources = Source.extractQuerySource(query)
    expect(sources).to.deep.equal(returnSources)
  })

  it('should return items list from query parameter items=', () => {
    const returnQueries = ['query1', 'query2']
    const query = 'items=query1+query2'
    const items = Source.extractQueryItems(query)
    expect(items).to.deep.equal(returnQueries)
  })

  it('should return source list from query parameter list=', () => {
    const returnQueries = ['query1', 'query2']
    const query = '?list=query1+query2'
    const list = Source.extractQuerySourceList(query)
    expect(list).to.deep.equal(returnQueries)
  })

})
