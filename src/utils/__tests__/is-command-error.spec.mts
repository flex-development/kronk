/**
 * @file Unit Tests - isCommandError
 * @module kronk/utils/tests/unit/isCommandError
 */

import CommandError from '#errors/command.error'
import KronkError from '#errors/kronk.error'
import date from '#fixtures/date'
import testSubject from '#utils/is-command-error'

describe('unit:utils/isCommandError', () => {
  it.each<Parameters<typeof testSubject>>([
    [26],
    [date],
    [new Error('not a command error')],
    [new KronkError('kronk error, not a command error')],
    [null]
  ])('should return `false` if `value` is not `CommandError` (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `value` looks like `CommandError`', () => {
    expect(testSubject(new CommandError('', import.meta.url))).to.be.true
  })
})
