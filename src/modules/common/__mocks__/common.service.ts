
import { mockCollection } from '../../../../__mocks__/mongodb'

export class DbService {
  MAX_LIMIT = 50
  collection: any

  constructor (
    collection: any,
  ) {
    this.collection = mockCollection(collection)
  }

  paginate = jest.fn(() => Promise.resolve([]))
}
