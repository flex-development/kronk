/**
 * @file E2E Tests - errors
 * @module kronk/errors/tests/e2e/api
 */

import * as testSubject from '#errors/index'

describe('e2e:errors', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
