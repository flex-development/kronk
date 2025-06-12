/**
 * @file Unit Tests - isOption
 * @module kronk/utils/tests/unit/isOption
 */

import chars from '#enums/chars'
import date from '#fixtures/date'
import kOption from '#internal/k-option'
import Argument from '#lib/argument'
import Command from '#lib/command'
import Option from '#lib/option'
import testSubject from '#utils/is-option'

describe('unit:utils/isOption', () => {
  it.each<Parameters<typeof testSubject>>([
    [chars.digit5],
    [date],
    [new Argument('<>')],
    [new Command()],
    [null]
  ])('should return `false` if `value` is not `Option`-like (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [{ [kOption]: true }],
    [new Option('--option')]
  ])('should return `true` if `value` looks like `Option` (%#)', value => {
    expect(testSubject(value)).to.be.true
  })
})
