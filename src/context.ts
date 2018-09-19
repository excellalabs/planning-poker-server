
import { AuthenticationError } from 'apollo-server'
import { ServerResponse, IncomingHttpHeaders, IncomingMessage } from 'http'

import { JwtPayload } from './modules/auth/auth.types'
import { AuthService } from './modules/auth/auth.service'
import { User } from './modules/user/user.types'

export interface SubscriptionConnection {
  query: string
  variables: any
  operationName: string
  context: IncomingHttpHeaders
}

export interface SubscriptionPayload {
  query: string
  variables: any
  operationName: string
  extensions: any
}

export interface InitialContext {
  req?: IncomingMessage
  res?: ServerResponse
  connection?: SubscriptionConnection
  payload?: SubscriptionPayload
}

export interface Context extends InitialContext {
  authPayload?: JwtPayload
  user?: User
}

const AUTH_SCHEME = /^BEARER (.*)/i

/**
 * This is where we can set up the context for a particular request.
 * @param ctx The initial context of the request.  This contains the bare request and response from node http.
 */
export const contextFunction = async (ctx: InitialContext): Promise<Context> => {
  const { req, connection } = ctx
  if (req) {
    return handleHttp(ctx)
  } else if (connection) {
    return handleWebsocket(ctx)
  }

  return ctx
}

async function handleHttp (ctx: InitialContext): Promise<Context> {
  const authPayload = await decodeAuthorization(ctx.req!.headers.authorization)

  return {
    ...ctx,
    authPayload,
  }
}

async function handleWebsocket (ctx: InitialContext): Promise<Context> {
  const authPayload = await decodeAuthorization(ctx.connection!.context.authorization)

  return {
    ...ctx,
    authPayload,
  }
}

async function decodeAuthorization (authorization: string | undefined): Promise<JwtPayload | undefined> {
  if (!authorization) {
    return undefined
  }

  const match = AUTH_SCHEME.exec(authorization)
  if (!match || match[1].length === 0) {
    throw new AuthenticationError('Invalid `authorization` token')
  }

  try {
    const token = match[1]
    return await AuthService.instance.decodeJwt(token)
  } catch (_err) {
    throw new AuthenticationError('Invalid `authorization` token')
  }
}
