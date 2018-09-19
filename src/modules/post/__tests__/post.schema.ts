
import { ObjectID } from 'mongodb'
import { authorize } from '../../../helpers/authorize'
import { UserService } from '../../user/user.service'
import { PostService } from '../post.service'
import { PostPubSub } from '../post.pubsub'

import { postResolvers } from '../post.schema'

jest.mock('../../../helpers/authorize')
jest.mock('../../user/user.service')
jest.mock('../post.service')
jest.mock('../post.pubsub')

describe('post schema resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Query', () => {
    describe('posts', () => {
      it('should call PostService:findAll once', async () => {
        const pagination = {
          skip: 5,
        }

        await postResolvers.Query.posts.resolve({}, { pagination })

        expect(PostService.instance.findAll).toHaveBeenCalledTimes(1)
        expect(PostService.instance.findAll).toHaveBeenCalledWith(pagination)
      })

      it('should return the result of PostService:findAll', async () => {
        const posts = [{
          _id: new ObjectID(),
        }]
        ;(PostService.instance.findAll as jest.Mock).mockResolvedValue(posts)

        const result = await postResolvers.Query.posts.resolve({}, {})

        expect(result).toBe(posts)
      })
    })

    describe('post', () => {
      it('should call PostService:findById once', async () => {
        const postId = new ObjectID()

        await postResolvers.Query.post.resolve({}, { postId })

        expect(PostService.instance.findById).toHaveBeenCalledTimes(1)
        expect(PostService.instance.findById).toHaveBeenCalledWith(postId)
      })

      it('should return the result of PostService:findById', async () => {
        const post = {
          _id: new ObjectID(),
        }
        ;(PostService.instance.findById as jest.Mock).mockResolvedValue(post)

        const result = await postResolvers.Query.post.resolve({}, { postId: new ObjectID() })

        expect(result).toBe(post)
      })
    })
  })

  describe('Mutation', () => {
    describe('createPost', () => {
      it('should call authorize once', async () => {
        const context = {}

        await postResolvers.Mutation.createPost.resolve(
          {},
          { content: 'foo' },
          context,
        )

        expect(authorize).toHaveBeenCalledTimes(1)
        expect(authorize).toHaveBeenCalledWith(context)
      })

      it('should call PostSerive:createPost once', async () => {
        const userId = new ObjectID()
        const args = { content: 'test content' }
        ;(authorize as jest.Mock).mockResolvedValueOnce({ _id: userId })

        await postResolvers.Mutation.createPost.resolve(
          {},
          args,
          {},
        )

        expect(PostService.instance.createPost).toHaveBeenCalledTimes(1)
        expect(PostService.instance.createPost).toHaveBeenCalledWith(userId, args)
      })

      it('should return the result of PostService:createPost', async () => {
        const post = {
          _id: new ObjectID(),
        }
        ;(PostService.instance.createPost as jest.Mock).mockResolvedValue(post)

        const result = await postResolvers.Mutation.createPost.resolve({}, { content: 'baz' }, {})

        expect(result).toBe(post)
      })
    })

    describe('updatePost', () => {
      it('should call authorize once', async () => {
        const context = {}

        await postResolvers.Mutation.createPost.resolve(
          {},
          { content: 'foo' },
          context,
        )

        expect(authorize).toHaveBeenCalledTimes(1)
        expect(authorize).toHaveBeenCalledWith(context)
      })

      it('should call PostSerive:updatePost once', async () => {
        const userId = new ObjectID()
        const args = { postId: new ObjectID(), data: { content: 'test content' } }
        ;(authorize as jest.Mock).mockResolvedValueOnce({ _id: userId })

        await postResolvers.Mutation.updatePost.resolve(
          {},
          args,
          {},
        )

        expect(PostService.instance.updatePost).toHaveBeenCalledTimes(1)
        expect(PostService.instance.updatePost).toHaveBeenCalledWith(userId, args)
      })

      it('should call PostPubSub:publishUpdate once', async () => {
        const post = {
          _id: new ObjectID(),
        }
        ;(PostService.instance.updatePost as jest.Mock).mockResolvedValueOnce(post)

        await postResolvers.Mutation.updatePost.resolve(
          {},
          { postId: new ObjectID(), data: { content: 'baf' } },
          {},
        )

        expect(PostPubSub.instance.publishUpdate).toHaveBeenCalledTimes(1)
        expect(PostPubSub.instance.publishUpdate).toHaveBeenCalledWith(post)
      })

      it('should return the result of PostService:updatePost', async () => {
        const post = {
          _id: new ObjectID(),
        }
        ;(PostService.instance.updatePost as jest.Mock).mockResolvedValue(post)

        const result = await postResolvers.Mutation.updatePost.resolve(
          {},
          { postId: new ObjectID(), data: { content: 'baz' } },
          {},
        )

        expect(result).toBe(post)
      })
    })
  })

  describe('Subscription', () => {
    describe('post', () => {
      it('should call PostService:findById$ once', async () => {
        const postId = new ObjectID()

        await postResolvers.Subscription.post.subscribe({}, { postId })

        expect(PostService.instance.findById$).toHaveBeenCalledTimes(1)
        expect(PostService.instance.findById$).toHaveBeenCalledWith(postId)
      })

      it('should call PostPubSub:listenForUbdates once', async () => {
        const post = {
          _id: new ObjectID(),
        }
        ;(PostService.instance.findById$ as jest.Mock).mockResolvedValue(post)

        await postResolvers.Subscription.post.subscribe({}, { postId: new ObjectID() })

        expect(PostPubSub.instance.listenForUpdates).toHaveBeenCalledTimes(1)
        expect(PostPubSub.instance.listenForUpdates).toHaveBeenCalledWith(post)
      })

      it('should return the result of PostPubSub:listenForUpdates', async () => {
        const expected = {
          some: 'stuff',
        }
        ;(PostPubSub.instance.listenForUpdates as jest.Mock).mockResolvedValue(expected)

        const result = await postResolvers.Subscription.post.subscribe({}, { postId: new ObjectID() })

        expect(result).toBe(expected)
      })
    })
  })

  describe('Post', () => {
    describe('poster', () => {
      it('should call UserService:findById$ once', async () => {
        const posterId = new ObjectID()

        await postResolvers.Post.poster.resolve({
          content: 'fez',
          posterId,
        })

        expect(UserService.instance.findById$).toHaveBeenCalledTimes(1)
        expect(UserService.instance.findById$).toHaveBeenCalledWith(posterId)
      })

      it('should return the result of UserService:findById$', async () => {
        const user = {
          _id: new ObjectID(),
        }
        ;(UserService.instance.findById$ as jest.Mock).mockResolvedValue(user)

        const result = await postResolvers.Post.poster.resolve({
          content: 'fad',
          posterId: new ObjectID(),
        })

        expect(result).toBe(user)
      })
    })
  })
})
