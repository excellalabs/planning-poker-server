
import { Collection, ObjectID } from 'mongodb'
import { hash, compare } from 'bcrypt'
import { test as passwordTest } from 'owasp-password-strength-test'
import { fail } from 'assert'
import { BCRYPT_SALT_ROUNDS } from '../../../config'
import { InputValidationError } from '../../../errors'
import { LoginError } from '../../auth/auth.errors'
import {
  UserNotFoundError,
  UserExistsError,
  PasswordStrengthError,
  SetPasswordMismatchError,
} from '../user.errors'
import { User } from '../user.types'

import { UserService } from '../user.service'

jest.mock('../../../config')
jest.mock('../../../db')
jest.mock('../../common/common.service')
jest.mock('../../../config')

const paginate: jest.Mock = (UserService.instance as any).paginate
const collection: Collection = (UserService.instance as any).collection

function checkProps (original: any, user: User | null) {
  (Object.keys(original) as (keyof User)[])
  .forEach(key => {
    if (key === 'passwordHash') {
      expect(user![key]).toBeUndefined()
    } else {
      expect(user![key]).toBe(original[key])
    }
  })
}

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    // tslint:disable-next-line
    let find = collection.find as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      find = collection.find = jest.fn()
    })

    it('should call this.collection.find once', async () => {
      await UserService.instance.findAll()

      expect(find).toHaveBeenCalledTimes(1)
    })

    it('should call this.paginate once with the supplied pagination data', async () => {
      const paginationData = {}

      await UserService.instance.findAll(paginationData)

      expect(paginate).toHaveBeenCalledTimes(1)
      expect(paginate.mock.calls[0][1]).toBe(paginationData)
    })

    it('should return users with appropriate props', async () => {
      const userCount = 10
      const users = [...new Array(userCount)].map((_a, i) => ({
        _id: new ObjectID(),
        username: (100 + i).toString(16),
        passwordHash: 'arbitrary hash',
      }))
      find.mockResolvedValueOnce(users)

      const result = await UserService.instance.findAll()

      result.forEach((user, idx) => {
        checkProps(users[idx], user)
      })
    })
  })

  describe('findById', () => {
    let findOne = collection.findOne as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      findOne = collection.findOne = jest.fn(() => Promise.resolve(null))
    })

    it('should call this.collection.findOne once with supplied _id', async () => {
      const _id = new ObjectID()

      await UserService.instance.findById(_id)

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne.mock.calls[0][0]._id).toBe(_id)
    })

    it('should return null if this.collection.findOne returns null', async () => {
      findOne.mockResolvedValueOnce(null)

      const result = await UserService.instance.findById(new ObjectID())

      expect(result).toBe(null)
    })

    it('should not return an object with passwordHash defined', async () => {
      findOne.mockResolvedValueOnce({
        _id: new ObjectID(),
        username: 'uzer',
        passwordHash: 'arbitrary hash',
      })

      const result = await UserService.instance.findById(new ObjectID())

      expect(result!.passwordHash).toBeUndefined()
    })

    it('should return a user with the appropriate props', async () => {
      const user = {
        _id: new ObjectID(),
        username: 'uzer',
        passwordHash: 'arbitrary hash',
      }
      findOne.mockResolvedValueOnce(user)

      const result = await UserService.instance.findById(new ObjectID())

      checkProps(user, result)
    })
  })

  describe('findById$', () => {
    let findOne = collection.findOne as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      findOne = collection.findOne = jest.fn(() => Promise.resolve(null))
    })

    it('should call this.collection.findOne once with supplied _id', async () => {
      findOne.mockResolvedValueOnce({})
      const _id = new ObjectID()

      await UserService.instance.findById$(_id)

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne.mock.calls[0][0]).toEqual({ _id })
    })

    it('should throw a UserNotFoundError if no user is found', async () => {
      findOne.mockResolvedValueOnce(null)

      const promise = UserService.instance.findById$(new ObjectID())

      await expect(promise).rejects.toBeInstanceOf(UserNotFoundError)
    })

    it('should return a user with the appropriate props', async () => {
      const user = {
        _id: new ObjectID(),
        username: 'uzer',
        passwordHash: 'arbitrary hash',
      }
      findOne.mockResolvedValueOnce(user)

      const result = await UserService.instance.findById$(new ObjectID())

      checkProps(user, result)
    })
  })

  describe('findByUsername', () => {
    let findOne = collection.findOne as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      findOne = collection.findOne = jest.fn(() => Promise.resolve(null))
    })

    it('should call this.collection.findOne once with supplied _id', async () => {
      const username = 'test-mctest'

      await UserService.instance.findByUsername(username)

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne.mock.calls[0][0]).toEqual({ username })
    })

    it('should return null if no user is found', async () => {
      findOne.mockResolvedValueOnce(null)

      const result = await UserService.instance.findByUsername('bizzfuzz')

      expect(result).toBe(null)
    })

    it('should return a user with the appropriate props', async () => {
      const user = {
        _id: new ObjectID(),
        username: 'uzer',
        passwordHash: 'arbitrary hash',
      }
      findOne.mockResolvedValueOnce(user)

      const result = await UserService.instance.findByUsername('user')

      checkProps(user, result)
    })
  })

  describe('findByUsername$', () => {
    let findOne = collection.findOne as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      findOne = collection.findOne = jest.fn(() => Promise.resolve(null))
    })

    it('should call this.collection.findOne once with supplied _id', async () => {
      const username = 'guy'

      await UserService.instance.findByUsername(username)

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne.mock.calls[0][0]).toEqual({ username })
    })

    it('should throw an error if no user is found', async () => {
      findOne.mockResolvedValueOnce(null)

      const promise = UserService.instance.findByUsername$('nom')
      await expect(promise).rejects.toBeInstanceOf(UserNotFoundError)
    })

    it('should return a user with the appropriate props', async () => {
      const user = {
        _id: new ObjectID(),
        username: 'uzer',
        passwordHash: 'arbitrary hash',
      }
      findOne.mockResolvedValueOnce(user)

      const result = await UserService.instance.findByUsername$('user')

      checkProps(user, result)
    })
  })

  describe('createUser', () => {
    let findOne = collection.findOne as jest.Mock
    let insertOne = collection.insertOne as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      findOne = collection.findOne = jest.fn(() => Promise.resolve(null))
      insertOne = collection.insertOne = jest.fn(() => Promise.resolve({ insertedCount: 1, value: {} }))
    })

    it('should throw an InputValidationError if the username is too short', async () => {
      const promise = UserService.instance.createUser({
        username: 'a',
        password: '123',
        verifyPassword: '123',
      })

      await expect(promise).rejects.toBeInstanceOf(InputValidationError)
    })

    it('should throw a UserExistsError if the username is already taken', async () => {
      findOne.mockResolvedValueOnce({}) // User already exists

      const promise = UserService.instance.createUser({
        username: 'good_username123',
        password: '123',
        verifyPassword: '123',
      })

      await expect(promise).rejects.toBeInstanceOf(UserExistsError)
    })

    it('should throw a SetPasswordMismatchError if the passwords do not match', async () => {
      const promise = UserService.instance.createUser({
        username: 'good_username123',
        password: 'one',
        verifyPassword: 'two',
      })

      await expect(promise).rejects.toBeInstanceOf(SetPasswordMismatchError)
    })

    it('should throw a PasswordStrengthError if the password is not strong enough', async () => {
      (passwordTest as jest.Mock).mockReturnValueOnce({
        strong: false,
        errors: [],
      })

      const promise = UserService.instance.createUser({
        username: 'good_username123',
        password: 'one',
        verifyPassword: 'one',
      })

      await expect(promise).rejects.toBeInstanceOf(PasswordStrengthError)
    })

    it('should call bcrypt.hash once', async () => {
      const password = 'password123'
      await UserService.instance.createUser({
        username: 'good_username123',
        password,
        verifyPassword: password,
      })

      expect(hash).toHaveBeenCalledTimes(1)
      expect(hash).toHaveBeenCalledWith(password, BCRYPT_SALT_ROUNDS)
    })

    it('should call this.collection.insertOne once', async () => {
      const username = 'mister.bob'
      const passwordHash = 'my hash'
      ;(hash as jest.Mock).mockResolvedValueOnce(passwordHash)

      await UserService.instance.createUser({
        username,
        password: '123',
        verifyPassword: '123',
      })

      expect(insertOne).toHaveBeenCalledTimes(1)
      expect(insertOne).toHaveBeenCalledWith({ username, passwordHash })
    })

    it('should return a user with the appropriate props', async () => {
      const _id = new ObjectID()
      const username = 'mister.bob'
      const passwordHash = 'my hash'
      ;(hash as jest.Mock).mockResolvedValueOnce(passwordHash)
      insertOne.mockResolvedValueOnce({
        insertedCount: 1,
        insertedId: _id,
      })

      const result = await UserService.instance.createUser({
        username,
        password: '123',
        verifyPassword: '123',
      })

      checkProps({
        _id,
        username,
        passwordHash,
      }, result)
    })
  })

  describe('changePassword', () => {
    let findOne = collection.findOne as jest.Mock
    let findOneAndUpdate = collection.findOneAndUpdate as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      findOne = collection.findOne = jest.fn(() => Promise.resolve(null))
      findOneAndUpdate = collection.findOneAndUpdate = jest.fn(() => Promise.resolve({ updatedCount: 1, value: {} }))
    })

    it('should throw a SetPasswordMismatchError if the passwords do not match', async () => {
      const promise = UserService.instance.changePassword(
        new ObjectID(),
        { password: 'one', verifyPassword: 'two' },
      )

      await expect(promise).rejects.toBeInstanceOf(SetPasswordMismatchError)
    })

    it('should throw a PasswordStrengthError if the password is not strong enough', async () => {
      (passwordTest as jest.Mock).mockReturnValueOnce({
        strong: false,
        errors: [],
      })

      const promise = UserService.instance.changePassword(
        new ObjectID(),
        { password: '123', verifyPassword: '123' },
      )

      await expect(promise).rejects.toBeInstanceOf(PasswordStrengthError)
    })

    it('should throw a UserNotFoundError if no user is found with the given id', async () => {
      // findOne.mockResolvedValueOnce(null)

      const promise = UserService.instance.changePassword(
        new ObjectID(),
        { password: '123', verifyPassword: '123' },
      )

      await expect(promise).rejects.toBeInstanceOf(UserNotFoundError)
    })

    it('should call bcrypt.hash once', async () => {
      findOne.mockResolvedValue({})
      findOneAndUpdate.mockResolvedValue({ value: {} })
      const password = 'password123'

      await UserService.instance.changePassword(
        new ObjectID(),
        {
          password,
          verifyPassword: password,
        },
      )

      expect(hash).toHaveBeenCalledTimes(1)
      expect(hash).toHaveBeenCalledWith(password, BCRYPT_SALT_ROUNDS)
    })

    it('should call this.collection.findOneAndUpdate once', async () => {
      const _id = new ObjectID()
      const passwordHash = 'my hash'
      findOne.mockResolvedValueOnce({})
      ;(hash as jest.Mock).mockResolvedValueOnce(passwordHash)

      await UserService.instance.changePassword(
        _id,
        {
          password: 'abc',
          verifyPassword: 'abc',
        },
      )

      expect(findOneAndUpdate).toHaveBeenCalledTimes(1)
      expect(findOneAndUpdate).toHaveBeenCalledWith(
        { _id },
        { $set: { passwordHash } },
        { returnOriginal: false },
      )
    })

    it('should return a user with the appropriate props', async () => {
      const user = {
        _id: new ObjectID(),
        username: 'dude',
        passwordHash: 'my hash',
      }
      findOne.mockResolvedValueOnce(user)
      findOneAndUpdate.mockResolvedValueOnce({ value: user })

      const result = await UserService.instance.changePassword(
        user._id,
        {
          password: 'abc',
          verifyPassword: 'abc',
        },
      )

      checkProps(user, result)
    })
  })

  describe('checkPassword', () => {
    let findOne = collection.findOne as jest.Mock

    beforeEach(() => {
      // clear mocked resolve values
      findOne = collection.findOne = jest.fn(() => Promise.resolve(null))
    })

    it('should throw a LoginError if the user does not exist', async () => {
      findOne.mockResolvedValue(null)

      const promise = UserService.instance.checkPassword('user', 'pass')

      await expect(promise).rejects.toBeInstanceOf(LoginError)
    })

    it('should throw a LoginError if the password does not match the passwordHash', async () => {
      findOne.mockResolvedValue({})
      ;(compare as jest.Mock).mockResolvedValueOnce(false)

      const promise = UserService.instance.checkPassword('user', 'pass')

      await expect(promise).rejects.toBeInstanceOf(LoginError)
    })

    it('should call bcrypt.compare once', async () => {
      const passwordHash = 'some hash'
      findOne.mockResolvedValue({
        passwordHash,
      })

      const password = 'pass'
      await UserService.instance.checkPassword('user', password)

      expect(compare).toHaveBeenCalledTimes(1)
      expect(compare).toHaveBeenCalledWith(password, passwordHash)
    })

    it('should return a user with the appropriate props', async () => {
      const user = {
        _id: new ObjectID(),
        username: 'dude',
        passwordHash: 'my hash',
      }
      findOne.mockResolvedValueOnce(user)

      const result = await UserService.instance.checkPassword('user', 'pass')

      checkProps(user, result)
    })
  })
})
