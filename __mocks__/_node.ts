
import { EventEmitter } from 'events'

export function mockEventEmitter (input: any = {}): EventEmitter {
  const emitter: EventEmitter = input
  emitter.addListener = jest.fn(() => emitter)
  emitter.on = jest.fn(() => emitter)
  emitter.once = jest.fn(() => emitter)
  emitter.prependListener = jest.fn(() => emitter)
  emitter.prependOnceListener = jest.fn(() => emitter)
  emitter.removeListener = jest.fn(() => emitter)
  emitter.off = jest.fn(() => emitter)
  emitter.removeAllListeners = jest.fn(() => emitter)
  emitter.setMaxListeners = jest.fn(() => emitter)
  emitter.getMaxListeners = jest.fn(() => 1)
  emitter.listeners = jest.fn(() => [])
  emitter.rawListeners = jest.fn(() => [])
  emitter.emit = jest.fn(() => true)
  emitter.eventNames = jest.fn(() => [])
  emitter.listenerCount = jest.fn(() => 0)

  return emitter
}
