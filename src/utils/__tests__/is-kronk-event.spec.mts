/**
 * @file Unit Tests - isKronkEvent
 * @module kronk/utils/tests/unit/isKronkEvent
 */

import KronkError from '#errors/kronk.error'
import KronkEvent from '#events/kronk.event'
import date from '#fixtures/date'
import kKronkEvent from '#internal/k-kronk-event'
import testSubject from '#utils/is-kronk-event'

describe('unit:utils/isKronkEvent', () => {
  it.each<Parameters<typeof testSubject>>([
    [13],
    [date],
    [new KronkError(import.meta.url)],
    [null]
  ])('should return `false` if `value` is not `KronkEvent`-like (%#)', v => {
    expect(testSubject(v)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [{ [kKronkEvent]: true }],
    [new KronkEvent('option:')]
  ])('should return `true` if `value` looks like `KronkEvent` (%#)', value => {
    expect(testSubject(value)).to.be.true
  })
})
