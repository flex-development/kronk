/**
 * @file E2E Tests - api
 * @module kronk/tests/e2e/api
 */

import * as testSubject from '@flex-development/kronk'

describe('e2e:kronk', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
