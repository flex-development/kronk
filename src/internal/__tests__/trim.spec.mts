/**
 * @file Unit Tests - trim
 * @module kronk/internal/tests/unit/trim
 */

import chars from '#enums/chars'
import testSubject from '#internal/trim'

describe('unit:internal/trim', () => {
  it.each<[value: null | undefined]>([
    [null],
    [undefined]
  ])('should return `value` if `null` or `undefined` (%j)', value => {
    expect(testSubject(value)).to.eq(value)
  })

  it.each<[value: string]>([
    [chars.ht],
    [chars.lf.repeat(2)],
    [chars.space.repeat(3)]
  ])('should return `null` if trimmed `value` is empty (%j)', value => {
    expect(testSubject(value)).to.be.null
  })

  it.each<[value: string]>([
    [chars.ht + chars.lowercaseA],
    [chars.lowercaseA + chars.lf],
    [chars.space + chars.lowercaseA]
  ])('should return non-empty trimmed string (%j)', value => {
    expect(testSubject(value)).toMatchSnapshot()
  })
})
