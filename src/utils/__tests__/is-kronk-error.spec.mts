/**
 * @file Unit Tests - isKronkError
 * @module kronk/utils/tests/unit/isKronkError
 */

import KronkError from '#errors/kronk.error'
import date from '#fixtures/date'
import testSubject from '#utils/is-kronk-error'

describe('unit:utils/isKronkError', () => {
  it.each<Parameters<typeof testSubject>>([
    [13],
    [date],
    [new Error('not a kronk error')],
    [null]
  ])('should return `false` if `value` is not `KronkError` (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `value` looks like `KronkError`', () => {
    expect(testSubject(new KronkError(import.meta.url))).to.be.true
  })
})
