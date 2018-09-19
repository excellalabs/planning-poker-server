
import { fail } from 'assert'
import { Collection, ObjectID } from 'mongodb'
import { PostService } from '../post.service'
import { PostNotFoundError, CannotEditPostError } from '../post.errors'

jest.mock('../../../db')
jest.mock('../../common/common.service')
jest.mock('../../../config')

const paginate: jest.Mock = (PostService.instance as any).paginate
const collection: Collection = (PostService.instance as any).collection

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    // tslint:disable-next-line
    const find = collection.find as jest.Mock

    it('should call this.collection.find once', async () => {
      await PostService.instance.findAll()

      expect(find).toHaveBeenCalledTimes(1)
    })

    it('should call this.paginate once with the supplied pagination data', async () => {
      const paginationData = {}

      await PostService.instance.findAll(paginationData)

      expect(paginate).toHaveBeenCalledTimes(1)
      expect(paginate.mock.calls[0][1]).toBe(paginationData)
    })
  })

  describe('findAllByPoster', () => {
    // tslint:disable-next-line
    const find = collection.find as jest.Mock

    it('should call this.collection.find once with supplied posterId', async () => {
      const posterId = new ObjectID()

      await PostService.instance.findAllByPoster(posterId)

      expect(find).toHaveBeenCalledTimes(1)
      expect(find.mock.calls[0][0].posterId).toBe(posterId)
    })

    it('should call this.paginate once with the supplied pagination data', async () => {
      const paginationData = {}

      await PostService.instance.findAllByPoster(new ObjectID(), paginationData)

      expect(paginate).toHaveBeenCalledTimes(1)
      expect(paginate.mock.calls[0][1]).toBe(paginationData)
    })
  })

  describe('findById', () => {
    const findOne = collection.findOne as jest.Mock

    it('should call this.collection.findOne once with supplied _id', async () => {
      const _id = new ObjectID()

      await PostService.instance.findById(_id)

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne.mock.calls[0][0]._id).toBe(_id)
    })

    it('should not throw an error if no post is found', async () => {
      findOne.mockResolvedValueOnce(null)

      await PostService.instance.findById(new ObjectID())
    })
  })

  describe('findById$', () => {
    const findOne = collection.findOne as jest.Mock

    it('should call this.collection.findOne once with supplied _id', async () => {
      findOne.mockResolvedValueOnce({})
      const _id = new ObjectID()

      await PostService.instance.findById$(_id)

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne.mock.calls[0][0]._id).toBe(_id)
    })

    it('should throw a PostNotFoundError if no post is found', async () => {
      findOne.mockResolvedValueOnce(null)

      try {
        await PostService.instance.findById$(new ObjectID())
        fail('should have thrown an error')
      } catch (err) {
        expect(err).toBeInstanceOf(PostNotFoundError)
      }
    })
  })

  describe('createPost', () => {
    const insertOne = collection.insertOne as jest.Mock

    it('should call this.collection.insertOne with the supplied posterId and content', async () => {
      const posterId = new ObjectID()
      const content = 'test content'

      await PostService.instance.createPost(posterId, { content })

      expect(insertOne).toHaveBeenCalledTimes(1)
      expect(insertOne.mock.calls[0][0]).toEqual({
        posterId,
        content,
      })
    })

    it('should return a post whose _id is the inserted id', async () => {
      const insertedId = new ObjectID()
      insertOne.mockResolvedValueOnce({
        insertedId,
        insertedCount: 1,
      })

      const newPost = await PostService.instance.createPost(new ObjectID(), {
        content: 'test content',
      })

      expect(newPost._id).toBe(insertedId)
    })

    it('should throw an error if this.collection.insertOne does not succeed', async () => {
      insertOne.mockResolvedValueOnce({
        insertedCount: 0,
      })

      try {
        await PostService.instance.createPost(new ObjectID(), {
          content: 'test content',
        })
        fail('should have thrown an error')
      } catch (err) {
        expect(err).toBeDefined()
      }
    })
  })

  describe('updatePost', () => {
    const findOne = collection.findOne as jest.Mock
    const findOneAndUpdate = collection.findOneAndUpdate as jest.Mock

    it('should call this.collection.findOneAndUpdate once', async () => {
      const postId = new ObjectID()
      const posterId = new ObjectID()
      findOne.mockResolvedValueOnce({
        _id: new ObjectID(),
        posterId,
        content: 'bar',
      })
      const data = {
        content: 'foo',
      }
      await PostService.instance.updatePost(posterId, {
        postId,
        data,
      })

      expect(findOneAndUpdate).toHaveBeenCalledTimes(1)
      expect(findOneAndUpdate).toHaveBeenCalledWith(
        { _id: postId, posterId },
        { $set: data },
        { returnOriginal: false },
      )
    })

    it('should throw a PostNotFoundError if no post is found with the given id', async () => {
      findOne.mockResolvedValueOnce(null)

      try {
        await PostService.instance.updatePost(new ObjectID(), {
          postId: new ObjectID(),
          data: {
            content: 'foo',
          },
        })
        fail('should have thrown an error')
      } catch (err) {
        expect(err).toBeInstanceOf(PostNotFoundError)
      }
    })

    it('should throw a CannotEditPostError if the wrong posterId is passed in', async () => {
      const posterId = new ObjectID()
      findOne.mockResolvedValueOnce({
        _id: new ObjectID(),
        posterId,
        content: 'bar',
      })

      try {
        await PostService.instance.updatePost(new ObjectID(), {
          postId: new ObjectID(),
          data: {
            content: 'foo',
          },
        })
        fail('should have thrown an error')
      } catch (err) {
        expect(err).toBeInstanceOf(CannotEditPostError)
      }
    })
  })
})
