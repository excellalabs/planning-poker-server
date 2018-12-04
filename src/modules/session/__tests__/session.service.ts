
import { fail } from 'assert'
import { Collection, ObjectID } from 'mongodb'
import { SessionService } from '../session.service'

jest.mock('../../../db')
jest.mock('../../common/common.service')
jest.mock('../../../config')

const collection: Collection = (SessionService.instance as any).collection

describe('SessionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createSession', () => {
    const insertOne = collection.insertOne as jest.Mock

    it('should call this.collection.insertOne with the supplied sessionId', async () => {
      const sessionId = '1234'

      await SessionService.instance.createSession()

      expect(insertOne).toHaveBeenCalledTimes(1)
      expect(insertOne.mock.calls[0][0]).toEqual({
        sessionId,
      })
    })

    it('should return a session whose _id is the inserted id', async () => {
      const insertedId = new ObjectID()
      insertOne.mockResolvedValueOnce({
        insertedId,
        insertedCount: 1,
      })

      const newPost = await SessionService.instance.createSession()

      expect(newPost._id).toBe(insertedId)
    })

    it('should throw an error if this.collection.insertOne does not succeed', async () => {
      insertOne.mockResolvedValueOnce({
        insertedCount: 0,
      })

      try {
        await SessionService.instance.createSession()
        fail('should have thrown an error')
      } catch (err) {
        expect(err).toBeDefined()
      }
    })
  })
})
