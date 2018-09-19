
import { ObjectID } from 'mongodb'
import { sign, verify } from 'jsonwebtoken'
import { AuthService } from '../auth.service'

const mockSign = sign as jest.Mock & typeof sign
const mockVerify = verify as jest.Mock & typeof verify

jest.mock('../../../config')

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('encodeJwt', () => {
    it('resolves a string', async () => {
      const result = await AuthService.instance.encodeJwt({ _id: new ObjectID() })

      expect(typeof result).toBe('string')
    })

    it('calls jsonwebtoken.sign exactly once', async () => {
      const _id = new ObjectID()
      await AuthService.instance.encodeJwt({ _id })

      expect(mockSign).toHaveBeenCalledTimes(1)
      expect(mockSign.mock.calls[0][0]).toEqual({
        _id: _id.toHexString(),
      })
    })
  })

  describe('decodeJwt', () => {
    it('resolves an object with prop _id which is an ObjectID', async () => {
      const result = await AuthService.instance.decodeJwt('test token')

      expect(result._id).toBeInstanceOf(ObjectID)
    })

    it('calls jsonwebtoken.verify exactly once', async () => {
      const token = 'test token'
      await AuthService.instance.decodeJwt(token)

      expect(mockVerify).toHaveBeenCalledTimes(1)
      expect(mockVerify.mock.calls[0][0]).toEqual(token)
    })
  })
})
