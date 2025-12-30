/**
 * @file Type Tests - UsageInfo
 * @module kronk/interfaces/tests/unit-d/UsageInfo
 */

import type TestSubject from '#interfaces/usage.info'
import type { UsageData } from '@flex-development/kronk'
import type { Nullable } from '@flex-development/tutils'

describe('unit-d:interfaces/UsageInfo', () => {
  it('should extend UsageData', () => {
    expectTypeOf<TestSubject>().toExtend<UsageData>()
  })

  it('should match [arguments: readonly string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('arguments')
      .toEqualTypeOf<readonly string[]>()
  })

  it('should match [options: string | null]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<Nullable<string>>()
  })

  it('should match [subcommand: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('subcommand')
      .toEqualTypeOf<string>()
  })
})
