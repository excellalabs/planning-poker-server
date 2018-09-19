
import { ObjectID } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { AuthService } from '../modules/auth/auth.service'

import { contextFunction } from '../context'

jest.mock('../modules/auth/auth.service')

describe('contextFunction', () => {
  describe('http', () => {
    const decodeJwt = AuthService.instance.decodeJwt as jest.Mock

    it('should not add authPayload if no authorization header is provided', async () => {
      const result = await contextFunction({
        req: {
          headers: {},
        } as any,
      })

      expect(result.authPayload).toBeUndefined()
    })

    it('should throw an AuthenticationError if the authorization header is malformed', async () => {
      const promise = contextFunction({
        req: {
          headers: {
            authorization: 'invalid header',
          },
        } as any,
      })

      await expect(promise).rejects.toBeInstanceOf(AuthenticationError)
    })

    it('should throw an AuthenticationError if AuthService:decodeJwt throws', async () => {
      decodeJwt.mockRejectedValue(new Error())

      const promise = contextFunction({
        req: {
          headers: {
            authorization: 'Bearer token',
          },
        } as any,
      })

      await expect(promise).rejects.toBeInstanceOf(AuthenticationError)
    })

    it('should return the result of AuthService:decodeJwt on the prop authPayload', async () => {
      const authPayload = {
        _id: new ObjectID(),
      }
      decodeJwt.mockResolvedValue(authPayload)

      const result = await contextFunction({
        req: {
          headers: {
            authorization: 'Bearer token',
          },
        } as any,
      })

      expect(result.authPayload).toBe(authPayload)
    })
  })

  describe('ws', () => {
    const decodeJwt = AuthService.instance.decodeJwt as jest.Mock

    it('should not add authPayload if no authorization header is provided', async () => {
      const result = await contextFunction({
        connection: {
          context: {},
        } as any,
      })

      expect(result.authPayload).toBeUndefined()
    })

    it('should throw an AuthenticationError if the authorization header is malformed', async () => {
      const promise = contextFunction({
        connection: {
          context: {
            authorization: 'invalid header',
          },
        } as any,
      })

      await expect(promise).rejects.toBeInstanceOf(AuthenticationError)
    })

    it('should throw an AuthenticationError if AuthService:decodeJwt throws', async () => {
      decodeJwt.mockRejectedValue(new Error())

      const promise = contextFunction({
        connection: {
          context: {
            authorization: 'Bearer token',
          },
        } as any,
      })

      await expect(promise).rejects.toBeInstanceOf(AuthenticationError)
    })

    it('should return the result of AuthService:decodeJwt on the prop authPayload', async () => {
      const authPayload = {
        _id: new ObjectID(),
      }
      decodeJwt.mockResolvedValue(authPayload)

      const result = await contextFunction({
        connection: {
          context: {
            authorization: 'Bearer token',
          },
        } as any,
      })

      expect(result.authPayload).toBe(authPayload)
    })
  })
})
