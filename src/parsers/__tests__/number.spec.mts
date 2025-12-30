/**
 * @file Unit Tests - number
 * @module kronk/parsers/tests/unit/number
 */

import chars from '#enums/chars'
import testSubject from '#parsers/number'

describe('unit:parsers/number', () => {
  it.each<Parameters<typeof testSubject>>([
    [26],
    [null],
    [chars.digit0],
    [chars.minus + chars.digit3],
    [chars.digit1 + chars.digit3],
    ['NEGATIVE_INFINITY'],
    ['number']
  ])('should return parsed number (%j)', value => {
    expect(testSubject(value)).toMatchSnapshot()
  })
})
