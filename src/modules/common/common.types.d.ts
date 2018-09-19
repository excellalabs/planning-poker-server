
import { ObjectID } from 'mongodb'

export const MAX_LIMIT = 50

export interface PaginationData {
  skip?: number
  limit?: number
}

export interface PaginationRequest {
  pagination?: PaginationData
}

export interface Document {
  _id?: ObjectID
}
