
import { ObjectID } from 'mongodb'
import { Document } from '../common/common.types'

export interface Post extends Document {
  content: string
  posterId: ObjectID
}

export interface CreatePostRequest {
  content: string
}

export interface UpdatePostRequest {
  postId: ObjectID
  data: Partial<Post>
}
