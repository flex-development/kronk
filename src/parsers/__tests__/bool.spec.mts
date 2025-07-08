/**
 * @file Unit Tests - bool
 * @module kronk/parsers/tests/unit/bool
 */

import chars from '#enums/chars'
import testSubject from '#parsers/bool'
import type { ParseArg } from '@flex-development/kronk'

describe('unit:parsers/bool', () => {
  it('should return argument parser', () => {
    expect(testSubject()).to.be.a('function').with.property('name', 'boolean')
  })

  describe('boolean', () => {
    let subject: ParseArg<boolean>

    beforeAll(() => {
      subject = testSubject()
    })

    it.each<Parameters<typeof subject>>([
      [chars.digit0, undefined],
      [chars.digit3, false],
      [chars.uppercaseY, true],
      [chars.false, undefined],
      [chars.lowercaseN, false]
    ])('should return `false` if `value` is not a truthy choice (%j)', (
      value,
      previous
    ) => {
      expect(subject(value, previous)).to.be.false
    })

    it.each<Parameters<typeof subject>>([
      [chars.digit1, false],
      [chars.true, true],
      [chars.lowercaseY, undefined]
    ])('should return `true` if `value` is a truthy choice (%j)', (
      value,
      previous
    ) => {
      expect(subject(value, previous)).to.be.true
    })
  })
})
