/**
 * @file E2E Tests - lib
 * @module kronk/lib/tests/e2e/api
 */

import * as testSubject from '#lib/index'

describe('e2e:lib', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
