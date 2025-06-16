/**
 * @file Type Tests - CommandUsageInfo
 * @module kronk/interfaces/tests/unit-d/CommandUsageInfo
 */

import type TestSubject from '#interfaces/command-usage.info'
import type { CommandUsageData } from '@flex-development/kronk'

describe('unit-d:interfaces/CommandUsageInfo', () => {
  it('should extend CommandUsageData', () => {
    expectTypeOf<TestSubject>().toExtend<CommandUsageData>()
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
