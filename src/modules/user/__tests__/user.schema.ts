
import { ObjectID } from 'mongodb'
import { UserService } from '../user.service'
import { PostService } from '../../post/post.service'
import { CreateUserRequest } from '../user.types'

import { userResolvers } from '../user.schema'

jest.mock('../../../context')
jest.mock('../../post/post.service')
jest.mock('../user.service')

describe('user schema resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Query', () => {
    describe('user', () => {
      it('should call UserService:findByUsername once', async () => {
        const username = 'test_user'

        await userResolvers.Query.user.resolve({}, { username })

        expect(UserService.instance.findByUsername).toHaveBeenCalledTimes(1)
        expect(UserService.instance.findByUsername).toHaveBeenCalledWith(username)
      })

      it('should return the result of UserService:findByUsername', async () => {
        const user = {
          _id: new ObjectID(),
        }

        ;(UserService.instance.findByUsername as jest.Mock).mockResolvedValue(user)

        const result = await userResolvers.Query.user.resolve({}, { username: 'foo' })

        expect(result).toBe(user)
      })
    })

    describe('userById', () => {
      it('should call UserService:findById once', async () => {
        const userId = new ObjectID()

        await userResolvers.Query.userById.resolve({}, { userId })

        expect(UserService.instance.findById).toHaveBeenCalledTimes(1)
        expect(UserService.instance.findById).toHaveBeenCalledWith(userId)
      })

      it('should return the result of UserService:findById', async () => {
        const user = {
          _id: new ObjectID(),
        }

        ;(UserService.instance.findById as jest.Mock).mockResolvedValue(user)

        const result = await userResolvers.Query.userById.resolve({}, { userId: new ObjectID() })

        expect(result).toBe(user)
      })
    })

    describe('users', () => {
      it('should call UserService:findAll once', async () => {
        const pagination = {
          skip: 4,
        }

        await userResolvers.Query.users.resolve({}, { pagination })

        expect(UserService.instance.findAll).toHaveBeenCalledTimes(1)
        expect(UserService.instance.findAll).toHaveBeenCalledWith(pagination)
      })

      it('should return the result of UserService:findAll', async () => {
        const users = [{
          _id: new ObjectID(),
        }]

        ;(UserService.instance.findAll as jest.Mock).mockResolvedValue(users)

        const result = await userResolvers.Query.users.resolve({}, {})

        expect(result).toBe(users)
      })
    })
  })

  describe('Mutation', () => {
    describe('createUser', () => {
      it('should call UserService:createUser once', async () => {
        const args: CreateUserRequest = {
          username: 'user_test',
          password: 'Pa$$V0rD',
          verifyPassword: 'Pa$$V0rD',
        }

        await userResolvers.Mutation.createUser.resolve({}, args)

        expect(UserService.instance.createUser).toHaveBeenCalledTimes(1)
        expect(UserService.instance.createUser).toHaveBeenCalledWith(args)
      })

      it('should return the result of UserService:createUser', async () => {
        const user = {
          _id: new ObjectID(),
        }

        ;(UserService.instance.createUser as jest.Mock).mockResolvedValue(user)

        const result = await userResolvers.Mutation.createUser.resolve({}, {
          username: 'baz',
          password: 'foo',
          verifyPassword: 'foo',
        })

        expect(result).toBe(user)
      })
    })
  })

  describe('User', () => {
    describe('posts', () => {
      it('should call PostService:findAllByPoster once', async () => {
        const pagination = {
          skip: 2,
          limit: 6,
        }
        const _id = new ObjectID()

        await userResolvers.User.posts.resolve(
          {
            _id,
            username: 'fizz',
            passwordHash: undefined,
          },
          { pagination },
        )

        expect(PostService.instance.findAllByPoster).toHaveBeenCalledTimes(1)
        expect(PostService.instance.findAllByPoster).toHaveBeenCalledWith(_id, pagination)
      })

      it('should return the result of PostService:findAllByPoster', async () => {
        const posts = [{
          _id: new ObjectID(),
        }]
        ;(PostService.instance.findAllByPoster as jest.Mock).mockResolvedValue(posts)

        const result = await userResolvers.User.posts.resolve(
          {
            _id: new ObjectID(),
            username: 'fizz',
            passwordHash: undefined,
          },
          {},
        )

        expect(result).toBe(posts)
      })
    })
  })
})
