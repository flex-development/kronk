/**
 * @file Unit Tests - uniq
 * @module kronk/parsers/tests/unit/uniq
 */

import chars from '#enums/chars'
import number from '#parsers/number'
import testSubject from '#parsers/uniq'
import type { ParseArg } from '@flex-development/kronk'

describe('unit:parsers/uniq', () => {
  it('should return argument parser', () => {
    // Act
    const result = testSubject()

    // Expect
    expect(result).to.have.property('name', 'unique')
    expect(result).to.have.property('restore').be.a('function')
  })

  describe('unique', () => {
    let subject: ParseArg<Set<number>>

    afterEach(() => {
      void subject.restore?.()
    })

    beforeAll(() => {
      subject = testSubject(number)
    })

    it.each<[value: string]>([
      [chars.digit1],
      [chars.digit3]
    ])('should store values in unique list', value => {
      // Act
      const result = (subject(value), subject(value))

      // Expect
      expect(result).to.be.instanceof(Set).and.have.property('size').gt(0)
      expect(result).toMatchSnapshot()
    })
  })
})
