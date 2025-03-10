/**
 * @file Unit Tests - snakecase
 * @module kronk/internal/tests/unit/snakecase
 */

import testSubject from '#internal/snakecase'

describe('unit:internal/snakecase', () => {
  it.each<Parameters<typeof testSubject>>([
    ['debug'],
    ['esbuild.log-level'],
    ['logLevel'],
    ['pizza-type'],
    ['resolve.conditions']
  ])('should return snake_case string (%j)', value => {
    expect(testSubject(value)).toMatchSnapshot()
  })
})
