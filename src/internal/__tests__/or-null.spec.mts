/**
 * @file Unit Tests - orNull
 * @module kronk/internal/tests/unit/orNull
 */

import chars from '#enums/chars'
import digits from '#fixtures/digits'
import testSubject from '#internal/or-null'

describe('unit:internal/orNull', () => {
  it.each<Parameters<typeof testSubject>>([
    [chars.space],
    [false],
    [undefined]
  ])('should return `null` if `value` is not truthy (%#)', value => {
    expect(testSubject(value)).to.be.null
  })

  it.each<Parameters<typeof testSubject>>([
    [chars.digit3 + chars.space],
    [digits]
  ])('should return `value` if `value` is truthy (%#)', value => {
    // Arrange
    const expected: unknown = typeof value === 'string' ? value.trim() : value

    // Act + Expect
    expect(testSubject(value)).to.eq(expected)
  })
})
