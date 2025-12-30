/**
 * @file Unit Tests - isKronkError
 * @module kronk/utils/tests/unit/isKronkError
 */

import chars from '#enums/chars'
import date from '#fixtures/date'
import kArgument from '#internal/k-argument'
import kCommand from '#internal/k-command'
import kCommandError from '#internal/k-command-error'
import kCommandEvent from '#internal/k-command-event'
import kKronkError from '#internal/k-kronk-error'
import kKronkEvent from '#internal/k-kronk-event'
import kOption from '#internal/k-option'
import kOptionEvent from '#internal/k-option-event'
import testSubject from '#utils/is-kronk-error'
import { codes } from '@flex-development/fsm-tokenizer'

describe('unit:utils/isKronkError', () => {
  it.each<Parameters<typeof testSubject>>([
    [[]],
    [codes.eof],
    [chars.delimiter],
    [date],
    [{ [kArgument]: true }],
    [{ [kCommand]: true }],
    [{ [kCommandError]: true }],
    [{ [kCommandEvent]: true }],
    [{ [kKronkEvent]: true }],
    [{ [kOption]: true }],
    [{ [kOptionEvent]: true }]
  ])('should return `false` if `value` is not `KronkError`-like (%#)', v => {
    expect(testSubject(v)).to.be.false
  })

  it('should return `true` if `value` looks like `KronkError`', () => {
    // Arrange
    const value: unknown = Object.defineProperties(new Error(), {
      [kKronkError]: { value: true }
    })

    // Act + Expect
    expect(testSubject(value)).to.be.true
  })
})
