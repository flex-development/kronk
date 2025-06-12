/**
 * @file Unit Tests - isCommandError
 * @module kronk/utils/tests/unit/isCommandError
 */

import CommandError from '#errors/command.error'
import KronkError from '#errors/kronk.error'
import date from '#fixtures/date'
import kCommandError from '#internal/k-command-error'
import kKronkError from '#internal/k-kronk-error'
import testSubject from '#utils/is-command-error'

describe('unit:utils/isCommandError', () => {
  it.each<Parameters<typeof testSubject>>([
    [26],
    [date],
    [new Error('not a command error')],
    [new KronkError('kronk error, not a command error')],
    [null]
  ])('should return `false` if `value` is not `CommandError`-like (%#)', v => {
    expect(testSubject(v)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [
      Object.defineProperties(new Error(), {
        [kCommandError]: { value: true },
        [kKronkError]: { value: true }
      })
    ],
    [new CommandError('', import.meta.url)]
  ])('should return `true` if `value` looks like `CommandError` (%#)', v => {
    expect(testSubject(v)).to.be.true
  })
})
