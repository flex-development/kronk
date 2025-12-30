/**
 * @file Unit Tests - unique
 * @module kronk/parsers/tests/unit/unique
 */

import testSubject from '#parsers/unique'

describe('unit:parsers/unique', () => {
  it('should have its own list', () => {
    expect(testSubject).to.have.property('list')
    expect(testSubject.list).eql(new Set()).and.not.be.frozen
  })
})
