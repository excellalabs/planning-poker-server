
import { mockEventEmitter } from './_node'

export class PubSub {
  protected ee = mockEventEmitter()
  publish = jest.fn(() => true)
  subscribe = jest.fn(() => Promise.resolve(1))
  unsubscribe = jest.fn()
  asyncIterator = jest.fn(() => (async function* () { /* noop */ })())
}
