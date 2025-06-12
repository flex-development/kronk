/**
 * @file Unit Tests - isKronkError
 * @module kronk/utils/tests/unit/isKronkError
 */

import KronkError from '#errors/kronk.error'
import date from '#fixtures/date'
import kKronkError from '#internal/k-kronk-error'
import testSubject from '#utils/is-kronk-error'

describe('unit:utils/isKronkError', () => {
  it.each<Parameters<typeof testSubject>>([
    [13],
    [date],
    [new Error('not a kronk error')],
    [null]
  ])('should return `false` if `value` is not `KronkError`-like (%#)', v => {
    expect(testSubject(v)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [Object.defineProperty(new Error(), kKronkError, { value: true })],
    [new KronkError(import.meta.url)]
  ])('should return `true` if `value` looks like `KronkError', value => {
    expect(testSubject(value)).to.be.true
  })
})
