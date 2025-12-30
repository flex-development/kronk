/**
 * @file Unit Tests - kCommandEvent
 * @module kronk/internal/tests/unit/kCommandEvent
 */

import testSubject from '#internal/k-command-event'

describe('unit:internal/kCommandEvent', () => {
  it('should have the description "kCommandEvent"', () => {
    expect(testSubject).to.have.property('description', 'kCommandEvent')
  })
})
