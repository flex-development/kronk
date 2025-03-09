/**
 * @file Unit Tests - isCommand
 * @module kronk/utils/tests/unit/isCommand
 */

import chars from '#enums/chars'
import date from '#fixtures/date'
import kCommand from '#internal/k-command'
import Argument from '#lib/argument'
import Option from '#lib/option'
import testSubject from '#utils/is-command'

describe('unit:utils/isCommand', () => {
  it.each<Parameters<typeof testSubject>>([
    [chars.digit3],
    [date],
    [new Argument('[]')],
    [new Option('--command')],
    [null]
  ])('should return `false` if `value` is not `Command` (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `value` looks like `Command`', () => {
    expect(testSubject({ [kCommand]: true })).to.be.true
  })
})
