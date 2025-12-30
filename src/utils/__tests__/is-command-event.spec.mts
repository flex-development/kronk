/**
 * @file Unit Tests - isCommandEvent
 * @module kronk/utils/tests/unit/isCommandEvent
 */

import chars from '#enums/chars'
import date from '#fixtures/date'
import kCommand from '#internal/k-command'
import kCommandError from '#internal/k-command-error'
import kCommandEvent from '#internal/k-command-event'
import kKronkError from '#internal/k-kronk-error'
import kKronkEvent from '#internal/k-kronk-event'
import kOption from '#internal/k-option'
import kOptionEvent from '#internal/k-option-event'
import testSubject from '#utils/is-command-event'
import { codes } from '@flex-development/fsm-tokenizer'

describe('unit:utils/isCommandEvent', () => {
  it.each<Parameters<typeof testSubject>>([
    [[]],
    [codes.eof],
    [chars.delimiter],
    [date],
    [{ [kCommand]: true }],
    [{ [kCommandError]: true }],
    [{ [kKronkError]: true }],
    [{ [kOption]: true }],
    [{ [kOptionEvent]: true }]
  ])('should return `false` if `value` is not `CommandEvent`-like (%#)', v => {
    expect(testSubject(v)).to.be.false
  })

  it('should return `true` if `value` looks like `CommandEvent`', () => {
    // Arrange
    const value: unknown = {
      [kCommandEvent]: { value: true },
      [kKronkEvent]: { value: true }
    }

    // Act + Expect
    expect(testSubject(value)).to.be.true
  })
})
