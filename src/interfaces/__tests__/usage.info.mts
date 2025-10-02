/**
 * @file Type Tests - UsageInfo
 * @module kronk/interfaces/tests/unit-d/UsageInfo
 */

import type TestSubject from '#interfaces/usage.info'
import type { UsageData } from '@flex-development/kronk'

describe('unit-d:interfaces/UsageInfo', () => {
  it('should extend UsageData', () => {
    expectTypeOf<TestSubject>().toExtend<UsageData>()
  })

  it('should match [options: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<string>()
  })

  it('should match [subcommand: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('subcommand')
      .toEqualTypeOf<string>()
  })
})
