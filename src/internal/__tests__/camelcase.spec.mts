/**
 * @file Unit Tests - camelcase
 * @module kronk/internal/tests/unit/camelcase
 */

import testSubject from '#internal/camelcase'

describe('unit:internal/camelcase', () => {
  it.each<Parameters<typeof testSubject>>([
    ['debug'],
    ['esbuild.log-level'],
    ['logLevel'],
    ['pizza-type'],
    ['resolve.conditions']
  ])('should return camelCased string (%j)', value => {
    expect(testSubject(value)).toMatchSnapshot()
  })
})
