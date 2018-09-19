
import { ObjectID } from 'mongodb'
import { getCollection } from '../../db'
import { DbService } from '../common/common.service'
import { PaginationData } from '../common/common.types'

import { PostNotFoundError, CannotEditPostError } from './post.errors'
import { Post, CreatePostRequest, UpdatePostRequest } from './post.types'

export class PostService extends DbService<Post> {
  constructor (
    collection = getCollection<Post>('posts'),
  ) {
    super(collection)
  }

  static instance = new PostService()

  async findAll (pagination?: PaginationData): Promise<Post[]> {
    const posts = await this.paginate(
      this.collection.find(),
      pagination,
    )
    return posts
  }

  async findAllByPoster (posterId: ObjectID, pagination?: PaginationData): Promise<Post[]> {
    const posts = await this.paginate(
      this.collection.find({ posterId }),
      pagination,
    )
    return posts
  }

  async findById (_id: ObjectID): Promise<Post | null> {
    const post = await this.collection.findOne({ _id })
    return post
  }

  async findById$ (_id: ObjectID): Promise<Post> {
    const post = await this.findById(_id)
    if (post === null) {
      throw new PostNotFoundError({ _id })
    }

    return post
  }

  async createPost (posterId: ObjectID, { content }: CreatePostRequest): Promise<Post> {
    const post: Post = {
      content,
      posterId,
    }

    const result = await this.collection.insertOne(post)
    if (result.insertedCount < 1) {
      throw new Error(`Post was not created correctly!`)
    }

    return {
      ...post,
      _id: result.insertedId,
    }
  }

  async updatePost (posterId: ObjectID, { postId, data }: UpdatePostRequest): Promise<Post> {
    const existingPost = await this.findById$(postId)
    if (!existingPost.posterId.equals(posterId)) {
      throw new CannotEditPostError()
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: postId, posterId },
      { $set: data },
      { returnOriginal: false },
    )

    return result.value!
  }
}
