/**
 * @file Unit Tests - atBreak
 * @module kronk/internal/tests/unit/atBreak
 */

import testSubject from '#internal/at-break'
import { codes } from '@flex-development/fsm-tokenizer'

describe('unit:internal/atBreak', () => {
  it.each<[keyof typeof codes]>([
    ['ht'],
    ['lf']
  ])('should return `false` if `code` is not break-like (codes.%s)', key => {
    expect(testSubject(codes[key])).to.be.false
  })

  it.each<[keyof typeof codes]>([
    ['break'],
    ['eof']
  ])('should return `true` if `code` is break-like (codes.%s)', key => {
    expect(testSubject(codes[key])).to.be.true
  })
})
