/**
 * @file Unit Tests - integer
 * @module kronk/parsers/tests/unit/integer
 */

import chars from '#enums/chars'
import testSubject from '#parsers/integer'

describe('unit:parsers/integer', () => {
  it.each<Parameters<typeof testSubject>>([
    [13],
    [3.13],
    [null],
    [chars.digit0],
    [chars.minus + chars.digit3],
    [chars.digit2 + chars.digit6],
    ['POSITIVE_INFINITY'],
    ['integer']
  ])('should return parsed integer (%j)', value => {
    expect(testSubject(value)).toMatchSnapshot()
  })
})
