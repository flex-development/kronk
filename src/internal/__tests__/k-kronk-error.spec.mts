/**
 * @file Unit Tests - kKronkError
 * @module kronk/internal/tests/unit/kKronkError
 */

import testSubject from '#internal/k-kronk-error'

describe('unit:internal/kKronkError', () => {
  it('should have the description "kKronkError"', () => {
    expect(testSubject).to.have.property('description', 'kKronkError')
  })
})
