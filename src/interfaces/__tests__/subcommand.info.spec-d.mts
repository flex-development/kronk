/**
 * @file Type Tests - SubcommandInfo
 * @module kronk/interfaces/tests/unit-d/SubcommandInfo
 */

import type TestSubject from '#interfaces/subcommand.info'
import type { CommandInfo } from '@flex-development/kronk'

describe('unit-d:interfaces/SubcommandInfo', () => {
  it('should extend CommandInfo', () => {
    expectTypeOf<TestSubject>().toExtend<CommandInfo>()
  })

  it('should match [name: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('name').toEqualTypeOf<string>()
  })
})
