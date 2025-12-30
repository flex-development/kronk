/**
 * @file Unit Tests - isOptionEvent
 * @module kronk/utils/tests/unit/isOptionEvent
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
import testSubject from '#utils/is-option-event'
import { codes } from '@flex-development/fsm-tokenizer'

describe('unit:utils/isOptionEvent', () => {
  it.each<Parameters<typeof testSubject>>([
    [[]],
    [codes.eof],
    [chars.delimiter],
    [date],
    [{ [kCommand]: true }],
    [{ [kCommandError]: true }],
    [{ [kCommandEvent]: true }],
    [{ [kKronkError]: true }],
    [{ [kOption]: true }]
  ])('should return `false` if `value` is not `OptionEvent`-like (%#)', v => {
    expect(testSubject(v)).to.be.false
  })

  it('should return `true` if `value` looks like `OptionEvent`', () => {
    // Arrange
    const value: unknown = {
      [kKronkEvent]: { value: true },
      [kOptionEvent]: { value: true }
    }

    // Act + Expect
    expect(testSubject(value)).to.be.true
  })
})
