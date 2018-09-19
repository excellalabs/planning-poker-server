
import { FilterQuery } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { DbNotFoundError } from '../../errors'

import { Post } from './post.types'

export class PostNotFoundError extends DbNotFoundError<Post> {
  constructor (query: FilterQuery<Post>) {
    super('Post', query)
  }
}

export class CannotEditPostError extends AuthenticationError {
  constructor () {
    super(`You cannot edit someone else's post.`)
  }
}
