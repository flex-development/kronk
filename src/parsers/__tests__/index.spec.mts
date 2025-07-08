/**
 * @file E2E Tests - parsers
 * @module kronk/parsers/tests/e2e/api
 */

import * as testSubject from '#parsers/index'

describe('e2e:parsers', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
