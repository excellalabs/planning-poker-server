
import { ObjectID } from 'mongodb'
import { BasePubSub } from '../../pubsub'

import { Post } from './post.types'

export interface UpdatePostData {
  post: Post
}

export class PostPubSub extends BasePubSub<UpdatePostData> {
  static instance = new PostPubSub()

  listenForUpdates (post: Post) {
    return this.makeSubscription(this.UPDATE_CODE(post._id!), {
      post,
    })
  }

  publishUpdate (post: Post) {
    this.publishData(this.UPDATE_CODE(post._id!), {
      post,
    })
  }

  private UPDATE_CODE (postId: ObjectID) {
    return `POST:UPDATE:${postId.toHexString()}`
  }
}
