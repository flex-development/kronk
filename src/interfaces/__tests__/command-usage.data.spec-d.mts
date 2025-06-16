/**
 * @file Type Tests - CommandUsageData
 * @module kronk/interfaces/tests/unit-d/CommandUsageData
 */

import type TestSubject from '#interfaces/command-usage.data'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/CommandUsageData', () => {
  it('should match [arguments?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('arguments')
      .toEqualTypeOf<Nilable<string>>()
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
