/**
 * @file Functional Tests - unique
 * @module kronk/parsers/tests/functional/unique
 */

import chars from '#enums/chars'
import testSubject from '#parsers/unique'

describe('functional:parsers/unique', () => {
  it('should store unique `value` in list', () => {
    // Act
    testSubject(chars.digit0)
    testSubject(chars.digit1)
    testSubject(chars.digit2)
    const result = testSubject(chars.digit2)

    // Expect
    expect(testSubject).to.have.property('list').be.instanceof(Set)
    expect(testSubject.list).to.have.property('size').gt(0)
    expect(result).to.eq(testSubject.list)
    expect(result).toMatchSnapshot()
  })
})
