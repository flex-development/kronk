/**
 * @file Unit Tests - isRawParseValue
 * @module kronk/utils/tests/unit/isRawParseValue
 */

import chars from '#enums/chars'
import digits from '#fixtures/digits'
import testSubject from '#utils/is-raw-parse-value'

describe('unit:utils/isRawParseValue', () => {
  it.each<Parameters<typeof testSubject>>([
    [false],
    [new Set()],
    [+chars.digit0],
    [[1, chars.digit1, 2, chars.digit2, 3, chars.digit3, null]]
  ])('should return `false` if `value` is not raw parse value (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [digits],
    [chars.digit0]
  ])('should return `true` if `value` is raw parse value (%#)', value => {
    expect(testSubject(value)).to.be.true
  })
})
