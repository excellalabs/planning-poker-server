
import { Collection } from 'mongodb'
import { mockCollection } from '../../__mocks__/mongodb'

export function getCollection<T> (collectionName: string): Collection<T> {
  return mockCollection<T>({
    collectionName,
    namespace: collectionName,
  })
}
