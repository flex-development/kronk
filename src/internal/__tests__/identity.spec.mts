/**
 * @file Unit Tests - identity
 * @module kronk/internal/tests/unit/identity
 */

import testSubject from '#internal/identity'
import type { TokenFields } from '@flex-development/fsm-tokenizer'

describe('unit:internal/identity', () => {
  let value: TokenFields

  beforeAll(() => {
    value = {}
  })

  it('should return `value`', () => {
    expect(testSubject(value)).to.eq(value)
  })
})
