/**
 * @file Unit Tests - isBreak
 * @module kronk/internal/tests/unit/isBreak
 */

import codes from '#enums/codes'
import testSubject from '#internal/is-break'

describe('unit:internal/isBreak', () => {
  it.each<Parameters<typeof testSubject>>([
    [codes.ht],
    [codes.lf]
  ])('should return `false` if `code` is not break code (%j)', code => {
    expect(testSubject(code)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [codes.break],
    [codes.eof]
  ])('should return `true` if `code` is break code (%j)', code => {
    expect(testSubject(code)).to.be.true
  })
})
