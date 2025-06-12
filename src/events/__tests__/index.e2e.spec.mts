/**
 * @file E2E Tests - events
 * @module kronk/errors/tests/e2e/api
 */

import * as testSubject from '@flex-development/kronk/events'

describe('e2e:events', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
