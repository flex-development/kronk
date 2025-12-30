/**
 * @file Unit Tests - isCommand
 * @module kronk/utils/tests/unit/isCommand
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
import testSubject from '#utils/is-command'
import { codes } from '@flex-development/fsm-tokenizer'

describe('unit:utils/isCommand', () => {
  it.each<Parameters<typeof testSubject>>([
    [[]],
    [codes.eof],
    [chars.delimiter],
    [date],
    [{ [kArgument]: true }],
    [{ [kCommandError]: true }],
    [{ [kCommandEvent]: true }],
    [{ [kKronkError]: true }],
    [{ [kKronkEvent]: true }],
    [{ [kOption]: true }],
    [{ [kOptionEvent]: true }]
  ])('should return `false` if `kCommand` is not in `value` (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `kCommand` in `value`', () => {
    expect(testSubject({ [kCommand]: true })).to.be.true
  })
})
