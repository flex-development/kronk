/**
 * @file E2E Tests - utils
 * @module kronk/utils/tests/e2e/api
 */

import * as testSubject from '#utils/index'

describe('e2e:utils', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
