/**
 * @file Unit Tests - isSet
 * @module kronk/internal/tests/unit/isSet
 */

import testSubject from '#internal/is-set'

describe('unit:internal/isSet', () => {
  it.each<Parameters<typeof testSubject>>([
    [null],
    [new Map()],
    [new WeakSet()]
  ])('should return `false` if `value` is not a Set (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `value` is a Set', () => {
    expect(testSubject(new Set())).to.be.true
  })
})
