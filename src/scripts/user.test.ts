import { expect } from 'chai'

import { UserJSON, } from '@models/user'
import {
  createUser,
  userToJSON,
  jsonToUser,
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
      avatar: user.avatar,
      preference: {
        theme: user.preference.theme
      },
      metrics: {
        visits: [],
      },
      memo: {
        history: [],
        saved: [],
      },
      created: user.created.getTime(),
      updated: user.updated.getTime(),
    }
    const json = userToJSON(user)
    expect(json).to.deep.equal(userJSON)
  })

  it('should convert user json to user', () => {
    const user = createUser('Penguin')
    const json = userToJSON(user)
    const converted = jsonToUser(json)

    expect(converted).to.deep.equal(user)
  })

})
