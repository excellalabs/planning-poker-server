
import { connect, Db, Collection } from 'mongodb'
import { MONGO_URI } from './config'

let db: Db

export async function createDb (): Promise<Db> {
  if (db) {
    return db
  }

  console.log('connecting to mongodb...')
  const client = await connect(MONGO_URI, { useNewUrlParser: true })
  db = client.db()
  console.log('connected to mongodb database:', db.databaseName)

  return db
}

export function getCollection<T> (collectionName: string): Collection<T> {
  return db.collection<T>(collectionName)
}
