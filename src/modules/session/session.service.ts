
import { ObjectID } from 'mongodb'
import { getCollection } from '../../db'
import { DbService } from '../common/common.service'
import { PaginationData } from '../common/common.types'

import { Session } from './session.types'

export class SessionService extends DbService<Session> {
  constructor (
    collection = getCollection<Session>('sessions'),
  ) {
    super(collection)
  }

  static instance = new SessionService()

  async createSession (): Promise<Session> {
    const sessionId = '1234'
    const session: Session = {
      sessionId,
    }

    const result = await this.collection.insertOne(session)
    if (result.insertedCount < 1) {
      throw new Error(`Session was not created correctly!`)
    }

    return {
      ...session,
      _id: result.insertedId,
    }
  }
}
