import { expect } from 'chai'

import {
  createUser,
  toJSON,
  toUser,
  UserJSON
} from './user'

describe('User', () => {

  it('should create a user without name', () => {
    const user = createUser()
    expect(user).to.not.be.undefined
  })

  it('should create user with a name', () => {
    const user = createUser('Penguin')
    expect(user.name).to.equal('Penguin')
  })

  it('should user convert to json', () => {
    const user = createUser('Penguin')
    const userJSON: UserJSON = {
      name: user.name,
      theme: 'auto-theme',
      created: user.created.getTime(),
      updated: user.updated.getTime()
    }
    const json = toJSON(user)
    expect(json).to.deep.equal(userJSON)
  })

  it('should convert user json to user', () => {
    const user = createUser('Penguin')
    const json = toJSON(user)
    const converted = toUser(json)

    expect(converted).to.deep.equal(user)
  })

})
