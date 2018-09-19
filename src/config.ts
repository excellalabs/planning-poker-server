
declare namespace config {
  export type Env = 'local' | 'development' | 'staging' | 'production'

  export interface Config {
    [key: string]: string | number | undefined
    PORT: number
    NODE_ENV: Env
    MONGO_URI: string
    JWT_SECRET: string
    BCRYPT_SALT_ROUNDS: number
  }
}

const defaultConfig: config.Config = {
  PORT: 3001,
  NODE_ENV: 'development',
  MONGO_URI: 'mongodb://localhost/planning-poker',
  JWT_SECRET: 'This is not a very good secret',
  BCRYPT_SALT_ROUNDS: 10,
}

const envConfig: Partial<config.Config> = {
  PORT: mapToNumber(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV as config.Env | undefined,
  MONGO_URI: process.env.MONGO_URI,
  BCRYPT_SALT_ROUNDS: mapToNumber(process.env.BCRYPT_SALT_ROUNDS),
}

function mapToNumber (str: string | undefined): number | undefined {
  return str ? parseInt(str, 10) : undefined
}

const config = {} as config.Config

Object.keys(defaultConfig).forEach(key => {
  config[key] = envConfig[key] || defaultConfig[key]
})

if (config.NODE_ENV === 'staging' || config.NODE_ENV === 'production') {
  const unsetKeys: string[] = []
  Object.keys(envConfig).forEach(key => {
    if (envConfig[key] === undefined) {
      unsetKeys.push(key)
    }
  })
  if (unsetKeys.length > 0) {
    throw new Error(`In ${config.NODE_ENV} mode, all configuration environment variables must be set! Unset: [$${unsetKeys.join(', $')}]`)
  }
}

export = config
