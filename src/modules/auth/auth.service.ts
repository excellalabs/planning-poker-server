
import { sign, verify } from 'jsonwebtoken'
import { ObjectID } from 'mongodb'
import { JWT_SECRET } from '../../config'

import { JwtPayload } from './auth.types'

const JWT_ALG = 'HS512'
const JWT_VALID_FOR = '10 days'

export class AuthService {
  private constructor () {}

  static readonly instance = new AuthService()

  async encodeJwt (payload: JwtPayload): Promise<string> {
    const _id = payload._id.toHexString()
    return new Promise<string>((resolve, reject) => {
      sign(
        { ...payload, _id },
        JWT_SECRET,
        { algorithm: JWT_ALG, expiresIn: JWT_VALID_FOR },
        (err, token) => {
          if (err) {
            reject(err)
          } else {
            resolve(token)
          }
        },
      )
    })
  }

  async decodeJwt (token: string): Promise<JwtPayload> {
    return new Promise<JwtPayload>((resolve, reject) => {
      verify(token, JWT_SECRET, { algorithms: [JWT_ALG] }, (err, payload: JwtPayload) => {
        if (err) {
          reject(err)
        } else {
          const _id = ObjectID.createFromHexString(payload._id as any)
          resolve({ ...payload, _id })
        }
      })
    })
  }
}
