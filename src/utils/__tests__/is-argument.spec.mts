/**
 * @file Unit Tests - isArgument
 * @module kronk/utils/tests/unit/isArgument
 */

import chars from '#enums/chars'
import date from '#fixtures/date'
import kArgument from '#internal/k-argument'
import Argument from '#lib/argument'
import Command from '#lib/command'
import Option from '#lib/option'
import testSubject from '#utils/is-argument'

describe('unit:utils/isArgument', () => {
  it.each<Parameters<typeof testSubject>>([
    [chars.digit9],
    [date],
    [new Command()],
    [new Option('--argument')],
    [null]
  ])('should return `false` if `value` is not `Argument`-like (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [{ [kArgument]: true }],
    [new Argument('[]')]
  ])('should return `true` if `value` is `Argument`-like (%#)', value => {
    expect(testSubject(value)).to.be.true
  })
})
