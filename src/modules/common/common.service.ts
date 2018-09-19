
import { Collection, Cursor } from 'mongodb'

import { PaginationData } from './common.types'

export class DbService<IDbType> {
  protected MAX_LIMIT = 50

  protected constructor (
    protected collection: Collection<IDbType>,
  ) {}

  protected async paginate (cursor: Cursor<IDbType>, pagination?: PaginationData): Promise<IDbType[]> {
    const { skip, limit } = this.standardizePagination(pagination)
    return cursor.skip(skip).limit(limit).toArray()
  }

  private standardizePagination (
    pagination: PaginationData = {},
    maxLimit = this.MAX_LIMIT,
    defaultLimit = 20,
  ): Required<PaginationData> {
    let { skip = 0, limit = defaultLimit } = pagination
    limit = Math.min(limit, maxLimit)

    return {
      skip,
      limit,
    }
  }
}
