/**
 * @file Type Tests - ParseUnknownResult
 * @module kronk/interfaces/tests/unit-d/ParseUnknownResult
 */

import type TestSubject from '#interfaces/parse-unknown-result'
import type { RequiredKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/ParseUnknownResult', () => {
  it('should have all required keys', () => {
    expectTypeOf<RequiredKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should match [operands: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('operands')
      .toEqualTypeOf<string[]>()
  })

  it('should match [unknown: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unknown')
      .toEqualTypeOf<string[]>()
  })
})
