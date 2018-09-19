
import 'reflect-metadata'
import { createDb } from './db'

(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator')

async function bootstrap () {
  await createDb()
  require('./server')
}

bootstrap().catch((err) => {
  console.error('Something went wrong during app bootstrap:')
  console.error(err)
  process.exit(1)
})
