
export class BasePubSub {
  publishData = jest.fn()

  makeSubscription = jest.fn(() => (_event: string, original?: any): AsyncIterator<T[K]> => {
    if (original === undefined) {
      return (async function* (): any { /* noop */ })()
    }

    return (async function* () { yield original })()
  })
}
