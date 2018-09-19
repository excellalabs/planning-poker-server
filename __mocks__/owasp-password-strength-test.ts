
import { TestResult } from 'owasp-password-strength-test'

export const test = jest.fn((): TestResult => ({
  errors: [],
  failedTests: [],
  passedTests: [],
  requiredTestErrors: [],
  optionalTestErrors: [],
  isPassphrase: false,
  strong: true,
  optionalTestsPassed: 0,
}))
