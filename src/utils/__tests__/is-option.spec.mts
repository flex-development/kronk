/**
 * @file Unit Tests - isOption
 * @module kronk/utils/tests/unit/isOption
 */

import chars from '#enums/chars'
import date from '#fixtures/date'
import kOption from '#internal/k-option'
import Argument from '#lib/argument'
import Command from '#lib/command'
import testSubject from '#utils/is-option'

describe('unit:utils/isOption', () => {
  it.each<Parameters<typeof testSubject>>([
    [chars.digit5],
    [date],
    [new Argument('<>')],
    [new Command()],
    [null]
  ])('should return `false` if `value` is not `Option` (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `value` looks like `Option`', () => {
    expect(testSubject({ [kOption]: true })).to.be.true
  })
})
