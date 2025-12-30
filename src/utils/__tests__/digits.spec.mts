/**
 * @file Unit Tests - digits
 * @module kronk/utils/tests/unit/digits
 */

import testSubject from '#utils/digits'

describe('unit:utils/digits', () => {
  it('should be frozen list of digits', () => {
    expect(testSubject).to.be.frozen
    expect(testSubject).toMatchSnapshot()
  })
})
