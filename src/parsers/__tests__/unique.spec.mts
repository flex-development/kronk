/**
 * @file Unit Tests - unique
 * @module kronk/parsers/tests/unit/unique
 */

import chars from '#enums/chars'
import testSubject from '#parsers/unique'

describe('unit:parsers/unique', () => {
  it.each<ReadonlySet<string>>([
    Object.freeze(new Set([chars.digit0, chars.digit1])),
    new Set([chars.lowercaseA, chars.lowercaseB, chars.lowercaseC])
  ])('should return `value` if `value` is a unique list', value => {
    expect(testSubject(value)).to.eq(value)
  })

  it('should return unique list created from `value`', () => {
    // Arrange
    const value: string[] = [chars.digit1, chars.digit1, chars.digit1]

    // Act
    const result = testSubject(value)

    // Expect
    expect(result).to.not.eq(value)
    expect(result).to.eql(new Set(value))
  })
})
