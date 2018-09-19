
import { Post } from '../post.types'
import { UpdatePostData } from '../post.pubsub'

export const PostPubSub = {
  instance: {
    listenForUpdates: jest.fn((post: Post): AsyncIterable<UpdatePostData> => {
      return (async function* () {
        yield { post }
      })()
    }),
    publishUpdate: jest.fn(),
  },
}
