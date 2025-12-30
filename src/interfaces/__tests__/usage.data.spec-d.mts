/**
 * @file Type Tests - UsageData
 * @module kronk/interfaces/tests/unit-d/UsageData
 */

import type TestSubject from '#interfaces/usage.data'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/UsageData', () => {
  it('should match [arguments?: readonly string[] | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('arguments')
      .toEqualTypeOf<Nilable<readonly string[] | string>>()
  })

  it('should match [options?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [subcommand?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('subcommand')
      .toEqualTypeOf<Nilable<string>>()
  })
})
