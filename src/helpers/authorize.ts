
import { AuthenticationError } from 'apollo-server'
import { Context } from '../context'
import { User } from '../modules/user/user.types'
import { UserService } from '../modules/user/user.service'

export async function authorize (context: Context): Promise<User> {
  if (!context.authPayload) {
    throw new AuthenticationError('You must provide the `authorization` header')
  }
  if (!context.user) {
    const user = await UserService.instance.findById(context.authPayload._id)
    if (user) {
      context.user = user
    } else {
      throw new AuthenticationError('Invalid `authorization` token')
    }
  }

  return context.user
}
