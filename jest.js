module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/.jest/setupTests.js',
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.js$': 'babel-jest',
  },
  testRegex: 'src/.*(__tests__/.*|\\.spec)\\.ts$',
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
  ],
  cacheDirectory: 'jestCache',
  globals: {
    __DEV__: true,
    'ts-jest': {
      'tsConfigFile': 'tsconfig.test.json',
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    // ignore untestable files
    '!src/bootstrap.ts',
    '!src/config.ts',
    '!src/schema.ts',
    '!src/server.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
}
