
import noopTag from '../noopTag'

describe('noopTag', () => {
  it('should return the same string as was passed in', () => {
    const greeting = 'Hello'
    const name = 'World'
    const expected = 'Hello, World'

    const actual = noopTag`${greeting}, ${name}`

    expect(actual).toBe(expected)
  })
})
