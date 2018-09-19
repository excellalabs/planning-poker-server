
// const npsUtils = require('nps-utils')

const nodeArgs = '--project ./tsconfig.json src/bootstrap.ts'

module.exports = {
  scripts: {
    default: {
      script: `ts-node ${nodeArgs}`,
      description: 'Starts the graphql server.',
    },
    dev: {
      script: `nodemon`,
      description: 'Runs the graphql app in watch mode with attachable debugger.',
      server: {
        script: `ts-node --inspect=9222 ${nodeArgs}`,
        description: 'Runs the graphql app with attachable debugger.',
        hiddenFromHelp: true,
      }
    },
    test: {
      script: `jest --config ./jest.js --runInBand`,
      description: 'Runs the unit tests.',
    },
    lint: {
      script: `tslint --project .`,
      description: 'Lints the code.',
    },
    check: {
      script: 'nps lint && nps test',
      description: 'Runs the checks to validate the application (test & lint).',
    },
    generate: {
      module: {
        script: `yo graphql:module`,
        description: 'Generates a new module in the graphql application.',
      },
    },
  },
}
