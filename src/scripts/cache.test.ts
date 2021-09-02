import { expect } from 'chai'

import { GetSourceList, SaveSourceList } from './cache'

describe('Cache', () => {

  it('should get source list', async () => {
    const sources = await GetSourceList()
    expect(sources).to.be.deep.equal([])
  })

  it('should save list', async () => {
    const list = ['hello', 'world']
    await SaveSourceList(list)
    const sources = await GetSourceList()
    expect(sources).to.deep.equal(list)
  })

})
