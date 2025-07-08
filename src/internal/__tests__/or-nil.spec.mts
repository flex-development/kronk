/**
 * @file Unit Tests - orNIL
 * @module kronk/internal/tests/unit/orNIL
 */

import chars from '#enums/chars'
import digits from '#fixtures/digits'
import testSubject from '#internal/or-nil'

describe('unit:internal/orNIL', () => {
  describe('non-string value', () => {
    it.each<Parameters<typeof testSubject>>([
      [+chars.digit0],
      [false]
    ])('should return `null` if `value` is defined but not truthy (%#)', v => {
      expect(testSubject(v)).to.be.null
    })

    it('should return `value` if `value` is `undefined`', () => {
      expect(testSubject(undefined)).to.be.undefined
    })

    it.each<Parameters<typeof testSubject>>([
      [+chars.digit3],
      [digits]
    ])('should return `value` if `value` is truthy (%#)', value => {
      expect(testSubject(value)).to.eq(value)
    })
  })

  describe('string value', () => {
    it('should return `null` if trimmed `value` is not truthy', () => {
      expect(testSubject(chars.space)).to.be.null
    })

    it.each<Parameters<typeof testSubject>>([
      [chars.digit0],
      [chars.digit3 + chars.space]
    ])('should return trimmed `value` if truthy (%#)', value => {
      // Arrange
      const expected: unknown = typeof value === 'string' ? value.trim() : value

      // Act + Expect
      expect(testSubject(value)).to.eq(expected)
    })
  })
})
