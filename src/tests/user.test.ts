import { expect } from 'chai'

import * as User from '@scripts/user'

describe('User', () => {

  it('should load user from localstorage or create new user', () => {
    User.request()
      .then((user) => {
        expect(user).to.be.an('object')
      })
  })

  // TODO: Test for user functionality

})
