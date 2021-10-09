import { expect } from 'chai'

import { getLocalSourceList, saveLocalSourceList } from './cache'

describe('cache using localstorage', () => {

  it('should get source list', async () => {
    const sources = await getLocalSourceList()
    expect(sources).to.be.deep.equal([])
  })

  it('should save list', async () => {
    const list = ['hello', 'world']
    await saveLocalSourceList(list)
    const sources = await getLocalSourceList()
    expect(sources).to.deep.equal(list)
  })

})
