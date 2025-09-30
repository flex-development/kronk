/**
 * @file Unit Tests - program
 * @module kronk/tests/unit/program
 */

import testSubject from '#program'

describe('unit:program', () => {
  it('should be root command', () => {
    expect(testSubject).to.have.nested.property('info.name').be.undefined
    expect(testSubject).to.have.property('parent').be.null
  })
})
