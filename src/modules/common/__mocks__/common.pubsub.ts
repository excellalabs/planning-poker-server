
export const HeartbeatPubSub = {
  instance: {
    listen: jest.fn((): AsyncIterable<boolean> => {
      return (async function* () {
        while (true) {
          yield true
          await sleep(5000)
        }
      })()
    }),
  },
}

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))
