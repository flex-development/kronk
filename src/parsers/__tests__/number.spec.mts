/**
 * @file Unit Tests - number
 * @module kronk/parsers/tests/unit/number
 */

import chars from '#enums/chars'
import testSubject from '#parsers/number'

describe('unit:parsers/number', () => {
  it('should return `NaN` if `value` is not a numeric', () => {
    expect(testSubject(chars.false)).to.be.NaN
  })

  it.each<Parameters<typeof testSubject>>([
    [chars.digit0],
    [chars.digit1],
    [chars.digit2],
    [chars.digit3],
    [chars.digit4],
    [chars.digit5],
    [chars.digit6],
    [chars.digit7],
    [chars.digit8],
    [chars.digit9],
    [chars.digit1 + chars.digit0 + chars.dot + chars.digit5]
  ])('should return parsed number (%j)', value => {
    expect(testSubject(value)).to.eq(+value)
  })
})
