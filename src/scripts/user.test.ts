import { expect } from 'chai'

import * as User from './user'

describe('User', () => {

  it('should create a user without name', () => {
    const user = User.createUser()
    expect(user).to.not.be.undefined
  })

  it('should create user with a name', () => {
    const user = User.createUser('Penguin')
    expect(user.name).to.equal('Penguin')
  })

})
