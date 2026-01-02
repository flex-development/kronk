/**
 * @file Unit Tests - isPromise
 * @module kronk/internal/tests/unit/isPromise
 */

import chars from '#enums/chars'
import testSubject from '#internal/is-promise'

describe('unit:internal/isPromise', () => {
  it.each<Parameters<typeof testSubject>>([
    [null],
    [chars.digit0],
    [new WeakMap()],
    [{ then: null }]
  ])('should return `false` if `value` is not a promise (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `value` is a promise', () => {
    expect(testSubject(new Promise(vi.fn()))).to.be.true
  })
})
