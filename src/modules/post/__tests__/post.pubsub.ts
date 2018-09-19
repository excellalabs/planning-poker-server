
import { ObjectID } from 'mongodb'
import { BasePubSub as MockBasePubSub } from '../../../__mocks__/pubsub'
import { Post } from '../post.types'

import { PostPubSub } from '../post.pubsub'

jest.mock('../../../pubsub')

const mockPubSub: MockBasePubSub = PostPubSub.instance as any

describe('PostPubSub', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('listenForUpdates', () => {
    it('should call BasePubSub:makeSubscription once', () => {
      const post: Post = {
        _id: new ObjectID(),
        content: 'foo',
        posterId: new ObjectID(),
      }

      PostPubSub.instance.listenForUpdates(post)

      expect(mockPubSub.makeSubscription).toHaveBeenCalledTimes(1)
      expect(mockPubSub.makeSubscription.mock.calls[0][1]).toEqual({ post })
    })

    it('should return the result of BasePubSub:makeSubscription', () => {
      const expected = {
        some: 'object',
      }
      mockPubSub.makeSubscription.mockReturnValue(expected)

      const result = PostPubSub.instance.listenForUpdates({
        _id: new ObjectID(),
        content: 'bar',
        posterId: new ObjectID(),
      })

      expect(result).toBe(expected)
    })
  })

  describe('publishUpdate', () => {
    it('should call BasePubSub:publishData once', () => {
      const post = {
        _id: new ObjectID(),
        content: 'bar',
        posterId: new ObjectID(),
      }

      PostPubSub.instance.publishUpdate(post)

      expect(mockPubSub.publishData).toHaveBeenCalledTimes(1)
      expect(mockPubSub.publishData.mock.calls[0][1]).toEqual({ post })
    })
  })
})
