
import { PubSub } from 'graphql-subscriptions'
import { BasePubSub } from '../../pubsub'

interface HeartbeatData {
  healthCheck: boolean
}

export class HeartbeatPubSub extends BasePubSub<HeartbeatData> {
  private readonly CODE = 'HEARTBEAT'

  constructor (core?: PubSub) {
    super(core)
    setInterval(this.publish, 5000)
  }

  static instance = new HeartbeatPubSub()

  listen () {
    return this.makeSubscription(this.CODE, {
      healthCheck: true,
    })
  }

  private publish = () => {
    this.publishData(this.CODE, {
      healthCheck: true,
    })
  }
}
