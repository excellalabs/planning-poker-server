
import { MongoClient, Db, Collection, AggregationCursor, Cursor, InsertOneWriteOpResult, WriteOpResult, UpdateWriteOpResult, ReplaceWriteOpResult, ChangeStream, FindAndModifyWriteOpResultObject } from 'mongodb'

import { mockEventEmitter } from './_node'

export const connect = jest.fn(() => {
  return mockClient()
})

export class ObjectID {
  constructor (
    private hexString = randomHexString(),
  ) {}

  toHexString () {
    return this.hexString
  }

  equals (oid: ObjectID) {
    return this.hexString === oid.hexString
  }

  static createFromHexString (hexString: string) {
    return new ObjectID(hexString)
  }
}

/**********************
 *    MOCK HELPERS    *
 **********************/

function randomHexString () {
  let output = ''
  for (let i = 0; i < 24; i++) {
    const val = Math.floor(Math.random() * 16)
    output += val.toString(16)
  }

  return output
}

const insertOneWriteOpResult: InsertOneWriteOpResult = {
  insertedCount: 1,
  ops: [],
  insertedId: new ObjectID() as any,
  connection: null,
  result: { ok: 1, n: 1 },
}

const writeOpResult: WriteOpResult = insertOneWriteOpResult

const updateWriteOpResult: UpdateWriteOpResult = {
  result: { ok: 0, n: 0, nModified: 0 },
  connection: null,
  matchedCount: 0,
  modifiedCount: 0,
  upsertedCount: 0,
  upsertedId: { _id: new ObjectID() as any },
}

const replaceWriteOpResult: ReplaceWriteOpResult = {
  ...updateWriteOpResult,
  ops: [],
}

const findAndModifyWriteOpResultObject: FindAndModifyWriteOpResultObject = {
  ok: 1,
}

export function mockClient (): MongoClient {
  const client: MongoClient = {
    connect: jest.fn(() => client),
    close: jest.fn(() => Promise.resolve()),
    db: jest.fn(mockDb),
    isConnected: jest.fn(() => true),
    logout: jest.fn(() => Promise.resolve(null)),
    startSession: jest.fn(() => ({})),
  } as any
  return client
}

export function mockDb (): Db {
  const db: Db = mockEventEmitter({
    serverConfig: {
      connections: jest.fn(() => []),
    } as any,
    bufferMaxEntries: 1,
    databaseName: 'test-db',
    options: {},
    native_parser: true,
    slaveOk: true,
    writeConcern: 'none',
    addUser: jest.fn(() => Promise.resolve(null)),
    admin: jest.fn(() => db),
    collection: jest.fn(mockCollection),
    collections: jest.fn(() => Promise.resolve([mockCollection()])),
    command: jest.fn(() => Promise.resolve(null)),
    createCollection: jest.fn(() => Promise.resolve(mockCollection())),
    createIndex: jest.fn(() => Promise.resolve(null)),
    dropCollection: jest.fn(() => Promise.resolve(true)),
    dropDatabase: jest.fn(() => Promise.resolve(null)),
    executeDbAdminCommand: jest.fn(() => Promise.resolve(null)),
    indexInformation: jest.fn(() => Promise.resolve(null)),
    listCollections: jest.fn(() => Promise.resolve(mockCursor)),
    profilingInfo: jest.fn(() => Promise.resolve(null)),
    profilingLevel: jest.fn(() => Promise.resolve('off')),
    removeUser: jest.fn(() => Promise.resolve(null)),
    renameCollection: jest.fn(() => Promise.resolve(mockCollection())),
    setProfilingLevel: jest.fn((level) => Promise.resolve(level)),
    stats: jest.fn(() => Promise.resolve(null)),
  }) as Db

  return db
}

export function mockCursor<T> (): Cursor<T> {
  const cursor: Cursor<T> = {
    sortValue: 'nothing',
    timeout: false,
    readPreference: {
      mode: 'PRIMARY',
      tags: {},
      options: {},
      isValid: jest.fn(() => true),
    },
    addCursorFlag: jest.fn(() => cursor),
    addQueryModifier: jest.fn(() => cursor),
    batchSize: jest.fn(() => cursor),
    clone: jest.fn(() => cursor),
    close: jest.fn(() => Promise.resolve()),
    collation: jest.fn(() => cursor),
    comment: jest.fn(() => cursor),
    count: jest.fn(() => Promise.resolve(0)),
    explain: jest.fn(() => Promise.resolve()),
    filter: jest.fn(() => cursor),
    forEach: jest.fn(() => Promise.resolve()),
    hasNext: jest.fn(() => Promise.resolve(false)),
    hint: jest.fn(() => cursor),
    isClosed: jest.fn(() => false),
    limit: jest.fn(() => cursor),
    map: jest.fn(() => cursor),
    max: jest.fn(() => cursor),
    maxAwaitTimeMS: jest.fn(() => cursor),
    maxScan: jest.fn(() => cursor),
    maxTimeMS: jest.fn(() => cursor),
    min: jest.fn(() => cursor),
    next: jest.fn(() => Promise.resolve(null)),
    project: jest.fn(() => cursor),
    read: jest.fn(),
    returnKey: jest.fn(() => cursor),
    rewind: jest.fn(() => cursor),
    setCursorOption: jest.fn(() => cursor),
    setReadPreference: jest.fn(() => cursor),
    showRecordId: jest.fn(() => cursor),
    skip: jest.fn(() => cursor),
    snapshot: jest.fn(() => cursor),
    sort: jest.fn(() => cursor),
    stream: jest.fn(() => cursor),
    toArray: jest.fn(() => Promise.resolve([])),
    unshift: jest.fn(),
  } as any
  return cursor
}

export function mockAggregationCursor<T> (): AggregationCursor<T> {
  const cursor: AggregationCursor<T> = {
    batchSize: jest.fn(() => cursor),
    clone: jest.fn(() => cursor),
    close: jest.fn(() => Promise.resolve()),
    each: jest.fn(),
    explain: jest.fn(() => Promise.resolve()),
    geoNear: jest.fn(() => cursor),
    group: jest.fn(() => cursor),
    isClosed: jest.fn(() => false),
    limit: jest.fn(() => cursor),
    match: jest.fn(() => cursor),
    maxTimeMS: jest.fn(() => cursor),
    next: jest.fn(() => Promise.resolve(null)),
    out: jest.fn(() => cursor),
    project: jest.fn(() => cursor),
    read: jest.fn(),
    redact: jest.fn(() => cursor),
    rewind: jest.fn(() => cursor),
    skip: jest.fn(() => cursor),
    sort: jest.fn(() => cursor),
    toArray: jest.fn(() => Promise.resolve([])),
    unshift: jest.fn(),
    unwind: jest.fn(() => cursor),
  } as any
  return cursor
}

function mockChangeStream (): ChangeStream {
  return {
    close: jest.fn(() => Promise.resolve(null)),
    hasNext: jest.fn(() => Promise.resolve(null)),
    isClosed: jest.fn(() => false),
    next: jest.fn(() => Promise.resolve(null)),
    stream: jest.fn(mockCursor),
  } as any
}

export function mockCollection<T> (
  {
    collectionName = 'collection',
    namespace = 'namespace',
  }: Partial<Collection<T>> = {
    collectionName: 'collection',
    namespace: 'namespace',
  },
): Collection<T> {
  const collection: Collection<T> = {
    collectionName,
    namespace,
    writeConcern: 'none',
    readConcern: 'none',
    hint: 'none',
    aggregate: jest.fn(mockAggregationCursor),
    bulkWrite: jest.fn(() => ({})),
    count: jest.fn(() => Promise.resolve(0)),
    countDocuments: jest.fn(() => Promise.resolve(0)),
    createIndex: jest.fn(spec => Promise.resolve(spec)),
    createIndexes: jest.fn(spec => Promise.resolve(spec)),
    deleteMany: jest.fn(() => Promise.resolve({})),
    deleteOne: jest.fn(() => Promise.resolve({})),
    distinct: jest.fn(() => Promise.resolve(null)),
    drop: jest.fn(() => Promise.resolve(null)),
    dropIndex: jest.fn(() => Promise.resolve(null)),
    dropIndexes: jest.fn(() => Promise.resolve(null)),
    estimatedDocumentCount: jest.fn(() => Promise.resolve(0)),
    find: jest.fn(mockCursor),
    findOne: jest.fn(() => Promise.resolve(null)),
    findOneAndDelete: jest.fn(() => Promise.resolve(findAndModifyWriteOpResultObject)),
    findOneAndReplace: jest.fn(() => Promise.resolve(findAndModifyWriteOpResultObject)),
    findOneAndUpdate: jest.fn(() => Promise.resolve(findAndModifyWriteOpResultObject)),
    geoHaystackSearch: jest.fn(() => Promise.resolve(null)),
    geoNear: jest.fn(() => Promise.resolve(null)),
    group: jest.fn(() => Promise.resolve(null)),
    indexes: jest.fn(() => Promise.resolve(null)),
    indexExists: jest.fn(() => Promise.resolve(false)),
    indexInformation: jest.fn(() => Promise.resolve(null)),
    initializeOrderedBulkOp: jest.fn(),
    initializeUnorderedBulkOp: jest.fn(),
    insert: jest.fn(() => Promise.resolve({
      ...insertOneWriteOpResult,
      insertedId: new ObjectID(),
    })),
    insertMany: jest.fn((docs: []) => Promise.resolve({
      ...insertOneWriteOpResult,
      insertedCount: docs.length,
      insertedIds: [...new Array(docs.length)].map(() => new ObjectID()),
    })),
    insertOne: jest.fn(() => Promise.resolve({
      ...insertOneWriteOpResult,
      insertedId: new ObjectID(),
    })),
    isCapped: jest.fn(() => Promise.resolve(null)),
    listIndexes: jest.fn(mockCursor),
    mapReduce: jest.fn(() => Promise.resolve(null)),
    options: jest.fn(() => Promise.resolve(null)),
    parallelCollectionScan: jest.fn(() => Promise.resolve([])),
    reIndex: jest.fn(() => Promise.resolve(null)),
    remove: jest.fn(() => Promise.resolve(writeOpResult)),
    rename: jest.fn(() => Promise.resolve(collection)),
    replaceOne: jest.fn(() => Promise.resolve(replaceWriteOpResult)),
    save: jest.fn(() => Promise.resolve(writeOpResult)),
    stats: jest.fn(() => Promise.resolve({})),
    update: jest.fn(() => Promise.resolve(writeOpResult)),
    updateMany: jest.fn(() => Promise.resolve(writeOpResult)),
    updateOne: jest.fn(() => Promise.resolve(writeOpResult)),
    watch: jest.fn(mockChangeStream),
  }
  return collection
}
