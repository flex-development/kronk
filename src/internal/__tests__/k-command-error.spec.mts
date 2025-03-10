/**
 * @file Unit Tests - kCommandError
 * @module kronk/internal/tests/unit/kCommandError
 */

import testSubject from '#internal/k-command-error'

describe('unit:internal/kCommandError', () => {
  it('should have the description "kCommandError"', () => {
    expect(testSubject).to.have.property('description', 'kCommandError')
  })
})
