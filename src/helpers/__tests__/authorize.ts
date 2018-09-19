
import { ObjectID } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { UserService } from '../../modules/user/user.service'
import { Context } from '../../context'

import { authorize } from '../authorize'

jest.mock('../../modules/user/user.service')

describe('authorize', () => {
  const findById = UserService.instance.findById as jest.Mock

  it('should call UserService:findById once', async () => {
    const _id = new ObjectID()
    await authorize({
      authPayload: { _id },
    })

    expect(findById).toHaveBeenCalledTimes(1)
    expect(findById).toHaveBeenCalledWith(_id)
  })

  it('should put the result of UserService.findById on the context', async () => {
    const user = {
      _id: new ObjectID(),
      username: 'me',
      passwordHash: undefined,
    }
    const context: Context = {
      authPayload: { _id: new ObjectID() },
    }
    findById.mockResolvedValue(user)

    await authorize(context)

    expect(context.user).toBe(user)
  })

  it('should return the user on the context if one already exists', async () => {
    const user = {
      _id: new ObjectID(),
      username: 'me',
      passwordHash: undefined,
    }

    const result = await authorize({
      authPayload: { _id: new ObjectID() },
      user,
    })

    expect(result).toBe(user)
  })

  it('should throw an AuthenticationError if there is no authPayload', async () => {
    const promise = authorize({})

    await expect(promise).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('should throw an AuthenticationError if no user is returned from UserService:findById', async () => {
    findById.mockResolvedValue(null)

    const promise = authorize({
      authPayload: { _id: new ObjectID() },
    })

    await expect(promise).rejects.toBeInstanceOf(AuthenticationError)
  })
})
