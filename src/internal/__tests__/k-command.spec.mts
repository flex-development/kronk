/**
 * @file Unit Tests - kCommand
 * @module kronk/internal/tests/unit/kCommand
 */

import testSubject from '#internal/k-command'

describe('unit:internal/kCommand', () => {
  it('should have the description "kCommand"', () => {
    expect(testSubject).to.have.property('description', 'kCommand')
  })
})
