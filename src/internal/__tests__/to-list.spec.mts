/**
 * @file Integration Tests - toList
 * @module kronk/internal/tests/unit/toList
 */

import testSubject from '#internal/to-list'

describe('unit:internal/toList', () => {
  it.each<Parameters<typeof testSubject>>([
    [[]],
    [Object.freeze([])],
    [Object.freeze(new Set())],
    [new Set()]
  ])('should return `value` if `value` is a list (%#)', value => {
    expect(testSubject(value)).to.eq(value)
  })

  it.each<Parameters<typeof testSubject>>([
    [null],
    [undefined]
  ])('should return empty list if `value` is `NIL` (%j)', value => {
    expect(testSubject(value)).to.be.an('array').and.eql([])
  })

  it('should return new list if `value` is not a list', () => {
    // Arrange
    const value: unknown = 13

    // Act + Expect
    expect(testSubject(value)).to.be.an('array').and.eql([value])
  })
})
