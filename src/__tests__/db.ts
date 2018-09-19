
import { Db } from 'mongodb'
import { MONGO_URI } from '../config'

import {
  createDb as originalCreateDb,
  getCollection as originalGetCollection,
} from '../db'

jest.mock('../config')

describe('db', () => {
  describe('getCollection', () => {
    let db: Db
    let getCollection: typeof originalGetCollection

    beforeEach(async () => {
      jest.resetModuleRegistry()
      jest.mock('../config')

      const dbModule = require('../db')
      db = await dbModule.createDb()
      getCollection = dbModule.getCollection
    })

    it('should call db.collection once', async () => {
      const collection = 'users'

      await getCollection(collection)

      expect(db.collection).toHaveBeenCalledTimes(1)
      expect(db.collection).toHaveBeenCalledWith(collection)
    })

    it('should return the result of db.collection', async () => {
      const collection = {
        collectionName: 'something',
      }
      ;(db.collection as jest.Mock).mockReturnValue(collection)

      const result = await getCollection('users')

      expect(result).toBe(collection)
    })
  })

  describe('createDb', () => {
    let createDb: typeof originalCreateDb
    let connect: jest.Mock

    beforeEach(() => {
      jest.resetModuleRegistry()
      jest.mock('../config')
      createDb = require('../db').createDb
      connect = require('mongodb').connect
    })

    it('should call mongodb:connect once even if called multiple times', async () => {
      await createDb()
      await createDb()

      expect(connect).toHaveBeenCalledTimes(1)
      expect(connect).toHaveBeenCalledWith(MONGO_URI, { useNewUrlParser: true })
    })

    it('should call client.db once even if called multiple times', async () => {
      const client = {
        db: jest.fn(() => ({
          databaseName: 'some-db',
        })),
      }
      connect.mockResolvedValue(client)

      await createDb()
      await createDb()

      expect(client.db).toHaveBeenCalledTimes(1)
      expect(client.db).toHaveBeenCalledWith()
    })

    it('should return the result of client.db', async () => {
      const db = {
        databaseName: 'some-db',
      }
      connect.mockResolvedValue({ db: jest.fn(() => db) })

      const result = await createDb()

      expect(result).toBe(db)
    })
  })
})
